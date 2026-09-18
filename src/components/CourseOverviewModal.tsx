import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  Code2,
  Terminal,
  Award,
  ChevronDown
} from 'lucide-react';
import {
  COURSE_CURRICULUM,
  CourseCurriculumInfo,
  getCourseCurriculum
} from '@/data/courseCurriculumGuide';

interface CourseOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTrackId?: string;
}

export default function CourseOverviewModal({
  isOpen,
  onClose,
  initialTrackId
}: CourseOverviewModalProps) {
  const navigate = useNavigate();
  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    initialTrackId || 'frontend'
  );
  const [activeTab, setActiveTab] = useState<'syllabus' | 'outcomes' | 'projects'>('syllabus');

  useEffect(() => {
    if (initialTrackId) {
      setSelectedTrackId(initialTrackId);
    }
  }, [initialTrackId, isOpen]);

  if (!isOpen) return null;

  const currentCourse: CourseCurriculumInfo =
    getCourseCurriculum(selectedTrackId) || COURSE_CURRICULUM[0];

  const handleNavigateToTrack = () => {
    onClose();
    navigate(currentCourse.route);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar with Course Switcher & Close */}
        <div className="p-4 sm:p-5 border-b border-border/40 bg-card/90 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-2xl shrink-0">
              {currentCourse.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-primary/15 text-primary border border-primary/30 font-semibold uppercase tracking-wider">
                  {currentCourse.credentialCode}
                </span>
                <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-secondary/50 border border-border/40">
                  {currentCourse.category}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                  {currentCourse.level}
                </span>
                <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                  {currentCourse.lessonsCount} Lessons
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold font-display text-foreground truncate">
                {currentCourse.title}
              </h2>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {currentCourse.inDepthSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Track Switcher Dropdown */}
            <div className="relative hidden md:block">
              <select
                value={selectedTrackId}
                onChange={e => setSelectedTrackId(e.target.value)}
                className="text-xs font-mono bg-secondary/60 hover:bg-secondary border border-border/40 rounded-lg px-2.5 py-1.5 pr-7 text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label="Switch course"
              >
                {COURSE_CURRICULUM.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.emoji} {c.shortTitle} ({c.credentialCode})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              aria-label="Close overview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border/40 bg-secondary/15 px-4 sm:px-6">
          {[
            { id: 'syllabus' as const, label: 'Course Syllabus & Modules', icon: BookOpen },
            { id: 'outcomes' as const, label: 'What You Will Be Able To Do', icon: CheckCircle2 },
            { id: 'projects' as const, label: 'Capstone Projects & Roles', icon: Sparkles },
          ].map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold font-display border-b-2 transition-all ${
                  active
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-sm flex-1">
          {/* TAB 1: SYLLABUS & MODULES */}
          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-secondary/20 border border-border/30 flex items-start gap-3">
                <Layers className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-foreground font-display">
                    Course Architecture & Sequential Progression
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    This course contains {currentCourse.lessonsCount} interactive lessons with live code verification, diagnostic quizzes, and progressive checkpoints.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {currentCourse.modules.map((mod, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-border/40 bg-secondary/10 hover:border-border/80 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-xs sm:text-sm text-foreground font-display flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span>{mod.title}</span>
                      </h5>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-7">
                      {mod.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pl-7 pt-1">
                      {mod.topics.map((topic, tidx) => (
                        <span
                          key={tidx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-background/60 border border-border/40 text-foreground/80"
                        >
                          • {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OUTCOMES & CAPABILITIES */}
          {activeTab === 'outcomes' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <Award className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 font-display">
                    Concrete Engineering Competencies
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Upon completing {currentCourse.title}, you will be equipped with verified, demonstrable skills:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {currentCourse.whatYouWillBeAbleToDo.map((outcome, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-border/30 bg-secondary/15"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                      {outcome}
                    </p>
                  </div>
                ))}
              </div>

              {/* Prerequisites Card */}
              <div className="p-3.5 rounded-xl border border-border/40 bg-secondary/20 space-y-1.5">
                <h5 className="text-xs font-bold font-mono uppercase text-muted-foreground tracking-wider">
                  Recommended Prerequisites
                </h5>
                <p className="text-xs text-foreground/85 leading-relaxed">
                  {currentCourse.prerequisites}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CAPSTONES & ROLES */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <Code2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-400 font-display">
                    Real-World Capstone Deliverables
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Portfolio-grade systems and hands-on projects you construct throughout this course:
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {currentCourse.capstoneProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-border/30 bg-secondary/15 flex items-center gap-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs font-mono font-bold shrink-0">
                      #{idx + 1}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      {proj}
                    </span>
                  </div>
                ))}
              </div>

              {/* Target Engineering Roles */}
              <div className="p-4 rounded-xl border border-border/40 bg-secondary/20 space-y-2">
                <h5 className="text-xs font-bold font-mono uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-primary" />
                  Target Industry Roles
                </h5>
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentCourse.targetRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/30 text-primary"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Direct Navigation */}
        <div className="p-3.5 px-5 border-t border-border/40 bg-card/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-muted-foreground text-center sm:text-left">
            <span>Course Track: </span>
            <strong className="text-foreground">{currentCourse.title}</strong>
            <span className="mx-1.5 opacity-40">·</span>
            <span>{currentCourse.lessonsCount} lessons</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-secondary/60 hover:bg-secondary border border-border/50 text-foreground transition-colors text-center"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleNavigateToTrack}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Go to Course</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
