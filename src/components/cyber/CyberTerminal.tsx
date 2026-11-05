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
  path: string;
  output: string;
  isSuccess?: boolean;
}

// In-Memory Virtual Linux File System (Zero KB download, 0 egress)
interface VFSNode {
  type: 'dir' | 'file';
  perms: string;
  owner: string;
  group: string;
  size: number;
  content?: string;
  children?: Record<string, VFSNode>;
}

const INITIAL_FS: Record<string, VFSNode> = {
  home: {
    type: 'dir',
    perms: 'drwxr-xr-x',
    owner: 'root',
    group: 'root',
    size: 4096,
    children: {
      codesage: {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'codesage',
        group: 'codesage',
        size: 4096,
        children: {
          'notes.txt': {
            type: 'file',
            perms: '-rw-r--r--',
            owner: 'codesage',
            group: 'codesage',
            size: 284,
            content: `[Mission Notes]\nTarget: 10.10.11.42 (Internal Corp Gateway)\nTODO: Check open ports, examine HTTP headers, inspect SUID binaries.`,
          },
          '.bash_history': {
            type: 'file',
            perms: '-rw-------',
            owner: 'codesage',
            group: 'codesage',
            size: 94,
            content: `nmap -sV 10.10.11.42\ncurl -I http://10.10.11.42\ncat /etc/passwd\nwhoami`,
          },
          'incident_report.txt': {
            type: 'file',
            perms: '-rw-r--r--',
            owner: 'codesage',
            group: 'codesage',
            size: 420,
            content: `[INCIDENT TRIAGE REPORT - ALERT #SEC-9021]
STATUS: UNDER ACTIVE INVESTIGATION
AFFECTED SYSTEM: web-gateway-01 (10.10.11.42)

OBSERVATIONS:
- Unauthenticated access attempted on internal metrics endpoint.
- Confidentiality: Public exposure of non-critical debug telemetry.
- Integrity: Core binaries & hash signatures intact.
- Availability: Verified reachable via HTTP/1.1 200 OK probe.

TRIAGE CONCLUSION: Confidentiality compromised via information disclosure. Verify external availability with curl.`,
          },
          'recon.sh': {
            type: 'file',
            perms: '-rwxr-xr-x',
            owner: 'codesage',
            group: 'codesage',
            size: 156,
            content: `#!/bin/bash\necho "[*] Running automated perimeter scan..."\nnmap -F 10.10.11.42`,
          },
        },
      },
    },
  },
  etc: {
    type: 'dir',
    perms: 'drwxr-xr-x',
    owner: 'root',
    group: 'root',
    size: 4096,
    children: {
      passwd: {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        size: 730,
        content: `root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\ncodesage:x:1000:1000:CodeSage Student,,,:/home/codesage:/bin/bash`,
      },
      shadow: {
        type: 'file',
        perms: '-rw-r-----',
        owner: 'root',
        group: 'shadow',
        size: 412,
        content: `root:$6$rounds=5000$saltstring$9x12m...KqP8Z:19240:0:99999:7:::\ncodesage:$6$rounds=5000$saltstring$L8m2x...P10a:19240:0:99999:7:::`,
      },
      hostname: {
        type: 'file',
        perms: '-rw-r--r--',
        owner: 'root',
        group: 'root',
        size: 9,
        content: `kali-box\n`,
      },
    },
  },
  var: {
    type: 'dir',
    perms: 'drwxr-xr-x',
    owner: 'root',
    group: 'root',
    size: 4096,
    children: {
      log: {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        size: 4096,
        children: {
          'auth.log': {
            type: 'file',
            perms: '-rw-r-----',
            owner: 'root',
            group: 'adm',
            size: 512,
            content: `Oct 24 14:22:01 kali sshd[1042]: Failed password for invalid user admin from 192.168.1.105 port 44122\nOct 24 14:22:03 kali sshd[1045]: Failed password for root from 192.168.1.105 port 44124\nOct 24 14:22:07 kali sshd[1050]: Accepted password for codesage from 192.168.1.50 port 50221 ssh2`,
          },
        },
      },
      www: {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'www-data',
        group: 'www-data',
        size: 4096,
        children: {
          html: {
            type: 'dir',
            perms: 'drwxr-xr-x',
            owner: 'www-data',
            group: 'www-data',
            size: 4096,
            children: {
              'index.php': {
                type: 'file',
                perms: '-rw-r--r--',
                owner: 'www-data',
                group: 'www-data',
                size: 210,
                content: `<?php\n// Vulnerable login endpoint\n$user = $_POST['user'];\n$query = "SELECT * FROM users WHERE username = '$user'";\n?>`,
              },
            },
          },
        },
      },
    },
  },
};

export const CyberTerminal: React.FC<CyberTerminalProps> = ({
  steps,
  completedSteps,
  onToggleStep,
}) => {
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState<string>('/home/codesage');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'system_init',
      path: '/home/codesage',
      output: 'Kali Linux 2026.1 (x86_64) - Cyber Security Terminal\nType "help" for commands, or use "cd", "ls", "cat", "nmap", "curl".',
    },
  ]);
  const [cmdIndex, setCmdIndex] = useState(-1);
  const [prevCommands, setPrevCommands] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Helper to extract clean executable commands from step strings
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

  // Virtual Filesystem Resolver
  const getNodeAtPath = (path: string): VFSNode | null => {
    const clean = path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    if (clean === '/') {
      return {
        type: 'dir',
        perms: 'drwxr-xr-x',
        owner: 'root',
        group: 'root',
        size: 4096,
        children: INITIAL_FS,
      };
    }
    const parts = clean.split('/').filter(Boolean);
    let curr: Record<string, VFSNode> = INITIAL_FS;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const node = curr[part];
      if (!node) return null;
      if (i === parts.length - 1) return node;
      if (node.type !== 'dir' || !node.children) return null;
      curr = node.children;
    }
    return null;
  };

  const resolvePath = (target: string): string => {
    if (!target || target === '~') return '/home/codesage';
    let base = target.startsWith('/') ? [] : currentPath.split('/').filter(Boolean);
    const parts = target.split('/').filter(Boolean);
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        if (base.length > 0) base.pop();
      } else {
        base.push(part);
      }
    }
    return '/' + base.join('/');
  };

  const handleCommandExecution = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
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
    let nextPath = currentPath;

    // 1. Mission Step Verification Check
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

    // 2. Command Parsing & Virtual Engine
    const [prog, ...args] = trimmed.split(/\s+/);
    const lowerProg = prog.toLowerCase();

    switch (lowerProg) {
      case 'help':
        output = `CodeSage Linux Terminal Simulator (Kali Suite)
Navigation:
  pwd                   - Print current directory
  cd <dir>              - Change directory (e.g. "cd ..", "cd /etc", "cd ~")
  ls [-la]              - List folder contents with Unix permissions
  cat <file>            - View file contents (e.g. "cat /etc/passwd")

Security Tools:
  whoami / id           - Check current user and UID/GID privileges
  uname -a              - Display simulated kernel info
  nmap [target] [-sV]   - Scan ports and services (10.10.11.42)
  curl -I [url]         - Inspect HTTP response headers
  grep <str> <file>     - Search patterns in logs (e.g. grep Failed /var/log/auth.log)
  find / -perm -4000    - Locate SUID privilege escalation binaries
  ps aux                - Display running process table
  chmod <mode> <file>   - Change file permissions (e.g. chmod 600 /etc/shadow)
  clear                 - Clear terminal screen`;
        break;

      case 'pwd':
        output = currentPath;
        break;

      case 'whoami':
        output = 'root';
        break;

      case 'id':
        output = 'uid=0(root) gid=0(root) groups=0(root),27(sudo),1000(codesage)';
        break;

      case 'uname':
        output = 'Linux kali-box 6.6.9-amd64 #1 SMP PREEMPT_DYNAMIC Kali 6.6.9-1kali1 (2026-01-10) x86_64 GNU/Linux';
        break;

      case 'cd': {
        const dest = args[0] || '~';
        const targetResolved = resolvePath(dest);
        const node = getNodeAtPath(targetResolved);
        if (!node) {
          output = `bash: cd: ${dest}: No such file or directory`;
        } else if (node.type !== 'dir') {
          output = `bash: cd: ${dest}: Not a directory`;
        } else {
          nextPath = targetResolved;
          setCurrentPath(nextPath);
          output = '';
        }
        break;
      }

      case 'ls': {
        const isLong = args.some(a => a.includes('l'));
        const targetArg = args.find(a => !a.startsWith('-')) || '.';
        const targetResolved = resolvePath(targetArg);
        const node = getNodeAtPath(targetResolved);

        if (!node) {
          output = `ls: cannot access '${targetArg}': No such file or directory`;
        } else if (node.type === 'file') {
          output = isLong ? `${node.perms} 1 ${node.owner} ${node.group} ${node.size} ${targetArg}` : targetArg;
        } else {
          const children = node.children || {};
          const keys = Object.keys(children);
          if (keys.length === 0) {
            output = '';
          } else if (isLong) {
            output = `total ${keys.length * 4}\n` +
              keys
                .map(k => {
                  const c = children[k];
                  return `${c.perms} 1 ${c.owner} ${c.group} ${String(c.size).padStart(5, ' ')} ${k}`;
                })
                .join('\n');
          } else {
            output = keys.join('    ');
          }
        }
        break;
      }

      case 'cat': {
        if (!args[0]) {
          output = 'cat: missing file operand';
        } else {
          const targetResolved = resolvePath(args[0]);
          const node = getNodeAtPath(targetResolved);
          if (!node) {
            output = `cat: ${args[0]}: No such file or directory`;
          } else if (node.type === 'dir') {
            output = `cat: ${args[0]}: Is a directory`;
          } else {
            output = node.content || '';
          }
        }
        break;
      }

      case 'chmod': {
        if (args.length < 2) {
          output = 'chmod: missing operand';
        } else {
          output = `[+] File mode changed: ${args[1]} -> ${args[0]}`;
        }
        break;
      }

      case 'curl': {
        output = `HTTP/1.1 200 OK\nDate: ${new Date().toUTCString()}\nServer: nginx/1.18.0 (Ubuntu)\nContent-Type: application/json; charset=utf-8\nContent-Length: 128\nConnection: keep-alive\nX-Content-Type-Options: nosniff\n[!] Security Notice: Missing Content-Security-Policy & Strict-Transport-Security headers!`;
        break;
      }

      case 'nmap': {
        output = `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for target.local (10.10.11.42)\nHost is up (0.012s latency).\nPORT     STATE SERVICE       VERSION\n22/tcp   open  ssh           OpenSSH 8.9p1 Ubuntu\n80/tcp   open  http          Apache httpd 2.4.52 ((Ubuntu))\n443/tcp  open  ssl/https     Apache httpd 2.4.52\nService detection performed. 1 host up scanned in 1.42 seconds.`;
        break;
      }

      case 'grep': {
        output = `Oct 24 14:22:01 kali sshd[1042]: Failed password for invalid user admin from 192.168.1.105 port 44122\nOct 24 14:22:03 kali sshd[1045]: Failed password for root from 192.168.1.105 port 44124`;
        break;
      }

      case 'find': {
        output = `/usr/bin/passwd\n/usr/bin/chfn\n/usr/bin/newgrp\n/usr/bin/sudo\n/opt/secret_backup (SUID Root privilege path identified!)`;
        break;
      }

      case 'ps': {
        output = `PID TTY          TIME CMD\n  1 ?        00:00:02 systemd\n412 ?        00:00:00 sshd\n820 pts/0    00:00:00 bash\n954 pts/0    00:00:00 python3`;
        break;
      }

      default:
        output = `[+] Executed: "${trimmed}"\nExit code: 0`;
        break;
    }

    if (isSuccess) {
      output = `[✓] MISSION OBJECTIVE VERIFIED!\n` + (output ? output : '');
    }

    setHistory(prev => [
      ...prev,
      {
        command: trimmed,
        path: currentPath === '/home/codesage' ? '~' : currentPath,
        output: output.trim(),
        isSuccess,
      },
    ]);
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

  const displayPromptPath = currentPath === '/home/codesage' ? '~' : currentPath;

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
              root@codesage:{displayPromptPath}#
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
                <span className="text-cyan-400 font-semibold">{item.path}</span>
                <span className="text-slate-300">#</span>
                <span className="text-slate-200 font-semibold">{item.command}</span>
              </div>
              {item.output && (
                <pre className={`text-[11px] whitespace-pre-wrap leading-relaxed ${item.isSuccess ? 'text-emerald-400' : 'text-slate-300'}`}>
                  {item.output}
                </pre>
              )}
            </div>
          ))}

          {/* Active Command Prompt Line */}
          <div className="flex items-center gap-1.5 pt-1 text-slate-200">
            <span className="text-emerald-400 font-bold shrink-0">root@codesage</span>
            <span className="text-slate-600 shrink-0">:</span>
            <span className="text-cyan-400 font-semibold shrink-0">{displayPromptPath}</span>
            <span className="text-slate-300 shrink-0">#</span>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="type security command (e.g. ls -la, cd /etc, cat passwd)..."
              className="bg-transparent border-none outline-none w-full text-white placeholder:text-slate-600 font-mono text-xs focus:ring-0 p-0"
            />
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
};
