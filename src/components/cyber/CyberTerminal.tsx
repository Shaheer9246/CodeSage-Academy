import React, { useState, useRef, useEffect } from 'react';
import { Terminal, CheckCircle2, Play, Sparkles, RefreshCw } from 'lucide-react';

interface CyberTerminalProps {
  lessonId: string;
  steps: string[];
  goal: string;
  completedSteps: Set<number>;
  onToggleStep: (stepIndex: number) => void;
}

interface CommandHistoryItem {
  command: string;
  output: string;
  isSuccess?: boolean;
}

export const CyberTerminal: React.FC<CyberTerminalProps> = ({
  steps,
  goal,
  completedSteps,
  onToggleStep,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'system_init',
      output: 'Kali Linux 2026.1 (x86_64)\nType "help" for built-in tools or run the mission commands below.',
    },
  ]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [prevCommands, setPrevCommands] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to terminal bottom on new output
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Extract clean commands from steps (lines without markdown comments)
  const extractStepCommands = () => {
    return steps
      .map((step, idx) => {
        const lines = step.split('\n');
        const cmdLine = lines.find(l => l.trim().length > 0 && !l.trim().startsWith('#'));
        return {
          idx,
          cmd: cmdLine ? cmdLine.trim().replace(/^`|`$/g, '') : '',
        };
      })
      .filter(item => item.cmd.length > 0);
  };

  const stepCommands = extractStepCommands();

  const handleCommandExecution = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setPrevCommands(prev => [...prev, trimmed]);
    setCmdIndex(-1);

    if (trimmed === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    let output = '';
    let isSuccess = false;

    // 1. Check if command matches any mission steps
    const matchedStep = stepCommands.find(s => {
      const baseCmd = s.cmd.toLowerCase().split(' ')[0];
      const userBase = trimmed.toLowerCase().split(' ')[0];
      return (
        trimmed.toLowerCase() === s.cmd.toLowerCase() ||
        (baseCmd === userBase && (trimmed.includes(s.cmd.slice(0, 10)) || s.cmd.includes(trimmed.slice(0, 10))))
      );
    });

    if (matchedStep && !completedSteps.has(matchedStep.idx)) {
      onToggleStep(matchedStep.idx);
      isSuccess = true;
    }

    // 2. Realistic Command Simulator Logic
    const lower = trimmed.toLowerCase();

    if (lower === 'help') {
      output = `Available Shell Utilities:
  nmap [target]          - Network mapper & port scanner
  curl -I [url]          - Inspect HTTP response headers
  grep [pattern] [file]  - Search threat signatures in logs
  find / -perm [flags]   - Enumerate SUID/SGID privilege paths
  ls -la / ps aux        - List directory contents & process tree
  whoami / id            - Inspect active credentials (root)
  cat [file]             - Dump file contents
  clear                  - Clear terminal buffer`;
    } else if (lower.startsWith('curl')) {
      output = `HTTP/1.1 200 OK
Date: ${new Date().toUTCString()}
Server: nginx/1.18.0 (Ubuntu)
Content-Type: application/json; charset=utf-8
Content-Length: 128
Connection: keep-alive
X-Content-Type-Options: nosniff
[!] Security Notice: Missing Content-Security-Policy & Strict-Transport-Security headers!`;
    } else if (lower.startsWith('nmap')) {
      output = `Starting Nmap 7.94 ( https://nmap.org )
Nmap scan report for target.local (10.10.11.42)
Host is up (0.012s latency).
PORT     STATE SERVICE       VERSION
22/tcp   open  ssh           OpenSSH 8.9p1 Ubuntu
80/tcp   open  http          Apache httpd 2.4.52 ((Ubuntu))
443/tcp  open  ssl/https     Apache httpd 2.4.52
Service detection performed. 1 host up scanned in 1.42 seconds.`;
    } else if (lower.startsWith('grep') || lower.includes('auth.log')) {
      output = `Oct 24 14:22:01 kali sshd[1042]: Failed password for invalid user admin from 192.168.1.105 port 44122
Oct 24 14:22:03 kali sshd[1045]: Failed password for root from 192.168.1.105 port 44124
Oct 24 14:22:06 kali sshd[1048]: Failed password for root from 192.168.1.105 port 44126
[+] Brute-force threshold exceeded (3 failures in 5s from 192.168.1.105)`;
    } else if (lower.startsWith('find')) {
      output = `/usr/bin/passwd
/usr/bin/chfn
/usr/bin/gpasswd
/usr/bin/sudo
/usr/bin/pkexec
[!] Potential escalation candidate discovered: /usr/bin/pkexec (Check CVE-2021-4034)`;
    } else if (lower === 'ls' || lower.startsWith('ls ')) {
      output = `-rw-r--r-- 1 root root  1024 Oct 24 12:00 auth.log
-rwxr-xr-x 1 root root  4096 Oct 24 12:01 exploit.py
-rw-r--r-- 1 root root   256 Oct 24 12:02 notes.txt
-rw-r--r-- 1 root root  8192 Oct 24 12:03 capture.pcap`;
    } else if (lower === 'whoami' || lower === 'id') {
      output = `uid=0(root) gid=0(root) groups=0(root)`;
    } else if (lower === 'pwd') {
      output = `/root/missions/security-lab`;
    } else if (lower.startsWith('cat')) {
      output = `[+] Reading target artifact:
# TARGET REPORT
Target IP: 10.10.11.42
Status: Compromise vector identified. Proceed to exploitation.`;
    } else if (lower.startsWith('ps')) {
      output = `PID TTY          TIME CMD
  1 ?        00:00:02 systemd
412 ?        00:00:00 sshd
820 pts/0    00:00:00 bash
954 pts/0    00:00:00 python3`;
    } else {
      output = `[+] Command executed: "${trimmed}"
Execution status: 0 (Success)`;
    }

    if (isSuccess) {
      output = `[✓] MISSION OBJECTIVE VERIFIED!\n` + output;
    }

    setHistory(prev => [...prev, { command: trimmed, output, isSuccess }]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandExecution(input);
    } else if (e.key === 'ArrowUp') {
      if (prevCommands.length > 0) {
        const nextIdx = cmdIndex + 1;
        if (nextIdx < prevCommands.length) {
          setCmdIndex(nextIdx);
          setInput(prevCommands[prevCommands.length - 1 - nextIdx]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      if (cmdIndex > 0) {
        const nextIdx = cmdIndex - 1;
        setCmdIndex(nextIdx);
        setInput(prevCommands[prevCommands.length - 1 - nextIdx]);
      } else if (cmdIndex === 0) {
        setCmdIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Quick Run Action Chips */}
      {stepCommands.length > 0 && (
        <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
          <p className="text-[10px] text-slate-400 font-sans font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles size={12} className="text-emerald-400" />
            Quick Command Actions (Tap to insert & run)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stepCommands.map(({ idx, cmd }) => {
              const isDone = completedSteps.has(idx);
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(cmd);
                    handleCommandExecution(cmd);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] border transition-all ${
                    isDone
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Play size={10} className={isDone ? 'text-emerald-400' : 'text-cyan-400'} />
                  <span className="truncate max-w-[200px]">{cmd}</span>
                  {isDone && <CheckCircle2 size={11} className="text-emerald-400 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Kali Linux Shell Window */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Terminal Titlebar */}
        <div className="bg-slate-900 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="font-semibold text-slate-300 flex items-center gap-1 ml-1.5">
              <Terminal size={12} className="text-emerald-400" />
              root@codesage:~
            </span>
          </div>
          <button
            onClick={() => setHistory([])}
            className="hover:text-white transition-colors"
            title="Clear buffer"
          >
            <RefreshCw size={12} />
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-3.5 max-h-[320px] sm:max-h-[380px] overflow-y-auto space-y-2.5 scrollbar-thin">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="text-emerald-400 font-bold">root@codesage</span>
                <span className="text-slate-600">:</span>
                <span className="text-cyan-400 font-semibold">~</span>
                <span className="text-slate-300">#</span>
                <span className="text-slate-200 font-semibold">{item.command}</span>
              </div>
              <pre className={`text-[11px] whitespace-pre-wrap leading-relaxed ${item.isSuccess ? 'text-emerald-400' : 'text-slate-300'}`}>
                {item.output}
              </pre>
            </div>
          ))}

          {/* Active Command Prompt Line */}
          <div className="flex items-center gap-1.5 pt-1 text-slate-200">
            <span className="text-emerald-400 font-bold shrink-0">root@codesage</span>
            <span className="text-slate-600 shrink-0">:</span>
            <span className="text-cyan-400 font-semibold shrink-0">~</span>
            <span className="text-slate-300 shrink-0">#</span>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="type security command (e.g. nmap, curl -I, help)..."
              className="bg-transparent border-none outline-none w-full text-white placeholder:text-slate-600 font-mono text-xs focus:ring-0 p-0"
            />
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
