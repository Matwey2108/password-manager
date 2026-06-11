import { useState } from "react";
import {
  Search,
  Plus,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Shield,
  BookOpen,
  GraduationCap,
  Library,
  Globe,
  X,
  Check,
} from "lucide-react";

type Category = "all" | "university" | "library" | "course" | "other";

interface ServiceEntry {
  id: string;
  name: string;
  login: string;
  password: string;
  category: Category;
  icon: string;
  url?: string;
}

const INITIAL_DATA: ServiceEntry[] = [
  { id: "1", name: "Электронный деканат", login: "s.petrov@uni.ru", password: "Univers!ty2024", category: "university", icon: "GraduationCap", url: "dekanat.uni.ru" },
  { id: "2", name: "Moodle (LMS)", login: "petrov_sergey", password: "Moodl3Pass#", category: "university", icon: "BookOpen", url: "moodle.uni.ru" },
  { id: "3", name: "ЭБС Лань", login: "student123456", password: "Lan!2024", category: "library", icon: "Library", url: "e.lanbook.com" },
  { id: "4", name: "eLIBRARY.RU", login: "petrov_s_a", password: "eLib$ecure1", category: "library", icon: "Library", url: "elibrary.ru" },
  { id: "5", name: "Coursera", login: "s.petrov@gmail.com", password: "C0urser@2024", category: "course", icon: "Globe", url: "coursera.org" },
  { id: "6", name: "Stepik", login: "petrov.student", password: "St3pik!Pass", category: "course", icon: "BookOpen", url: "stepik.org" },
  { id: "7", name: "VPN Университета", login: "petrov_s", password: "VpnUni#2024", category: "university", icon: "Shield", url: "vpn.uni.ru" },
];

const CATEGORIES: { id: Category; label: string; icon: React.ReactNode }[] = [
  { id: "all", label: "Все сервисы", icon: <Shield size={15} /> },
  { id: "university", label: "Университет", icon: <GraduationCap size={15} /> },
  { id: "library", label: "Библиотеки", icon: <Library size={15} /> },
  { id: "course", label: "Курсы", icon: <BookOpen size={15} /> },
  { id: "other", label: "Прочее", icon: <Globe size={15} /> },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap size={16} />,
  BookOpen: <BookOpen size={16} />,
  Library: <Library size={16} />,
  Globe: <Globe size={16} />,
  Shield: <Shield size={16} />,
};

const ICON_BY_CAT: Record<string, string> = {
  university: "GraduationCap",
  library: "Library",
  course: "BookOpen",
  other: "Globe",
};

const CATEGORY_BADGE: Record<Category, { label: string; color: string }> = {
  all: { label: "Все", color: "bg-gray-100 text-gray-600" },
  university: { label: "Университет", color: "bg-indigo-50 text-indigo-700" },
  library: { label: "Библиотека", color: "bg-emerald-50 text-emerald-700" },
  course: { label: "Курс", color: "bg-amber-50 text-amber-700" },
  other: { label: "Прочее", color: "bg-gray-100 text-gray-600" },
};

function PasswordCell({ password }: { password: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <span
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
        className="text-sm text-foreground select-none"
      >
        {visible ? password : "••••••••••"}
      </span>
      <button
        onClick={() => setVisible((v) => !v)}
        className="text-muted-foreground hover:text-foreground transition-colors rounded p-0.5"
        title={visible ? "Скрыть" : "Показать"}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

interface ModalProps {
  entry?: ServiceEntry;
  onClose: () => void;
  onSave: (entry: ServiceEntry) => void;
}

function ServiceModal({ entry, onClose, onSave }: ModalProps) {
  const [form, setForm] = useState<ServiceEntry>(
    entry ?? {
      id: String(Date.now()),
      name: "",
      login: "",
      password: "",
      category: "university",
      icon: "GraduationCap",
      url: "",
    }
  );
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.login.trim()) newErrors.login = true;
    if (!form.password.trim()) newErrors.password = true;
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave({ ...form, icon: ICON_BY_CAT[form.category] || "Globe" });
  };

  const inputClass = (field: string) =>
    `w-full bg-input-background rounded-lg px-3 py-2 text-sm text-foreground border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-md p-6 border border-border">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-foreground">{entry ? "Редактировать" : "Добавить сервис"}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Название сервиса</label>
            <input
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors(v => ({...v, name: false})); }}
              placeholder="Например: Moodle"
              className={inputClass("name")}
            />
            {errors.name && <p className="text-xs text-destructive mt-1">Введите название</p>}
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Логин / Email</label>
            <input
              value={form.login}
              onChange={(e) => { setForm({ ...form, login: e.target.value }); setErrors(v => ({...v, login: false})); }}
              placeholder="user@example.com"
              className={inputClass("login")}
            />
            {errors.login && <p className="text-xs text-destructive mt-1">Введите логин</p>}
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Пароль</label>
            <input
              type="text"
              value={form.password}
              onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors(v => ({...v, password: false})); }}
              placeholder="Введите пароль"
              className={inputClass("password")}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
            {errors.password && <p className="text-xs text-destructive mt-1">Введите пароль</p>}
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Категория</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
              className="w-full bg-input-background rounded-lg px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            >
              <option value="university">Университет</option>
              <option value="library">Библиотеки</option>
              <option value="course">Курсы</option>
              <option value="other">Прочее</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">URL (необязательно)</label>
            <input
              value={form.url ?? ""}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="example.com"
              className="w-full bg-input-background rounded-lg px-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Check size={14} />
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [entries, setEntries] = useState<ServiceEntry[]>(INITIAL_DATA);
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<{ open: boolean; entry?: ServiceEntry }>({ open: false });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = entries.filter((e) => {
    const matchCat = activeCategory === "all" || e.category === activeCategory;
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.login.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSave = (entry: ServiceEntry) => {
    setEntries((prev) => {
      const exists = prev.find((e) => e.id === entry.id);
      return exists ? prev.map((e) => (e.id === entry.id ? entry : e)) : [...prev, entry];
    });
    setModal({ open: false });
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setDeleteId(null);
  };

  const countFor = (cat: Category) =>
    cat === "all" ? entries.length : entries.filter((e) => e.category === cat).length;

  const recordCount = (n: number) => {
    if (n === 1) return "1 запись";
    if (n >= 2 && n <= 4) return `${n} записи`;
    return `${n} записей`;
  };

  const deleteEntry = deleteId ? entries.find((e) => e.id === deleteId) : null;

  return (
    <div
      className="size-full flex flex-col bg-background"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top bar */}
      <header className="bg-card border-b border-border px-6 py-3.5 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2.5 mr-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Shield size={14} className="text-primary-foreground" />
          </div>
          <span className="text-foreground font-semibold text-[15px] tracking-tight">
            Мои учебные пароли
          </span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по сервису или логину…"
            className="w-full bg-input-background rounded-lg pl-9 pr-3 py-2 text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition placeholder:text-muted-foreground"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="ml-auto">
          <button
            onClick={() => setModal({ open: true })}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Plus size={15} />
            Добавить сервис
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 bg-card border-r border-border flex flex-col pt-4 pb-6">
          <p className="px-4 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Категории
          </p>
          <nav className="flex flex-col gap-0.5 px-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    active
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={active ? "text-primary" : "text-muted-foreground"}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </span>
                  <span
                    className={`text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${
                      active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {countFor(cat.id)}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-auto px-4">
            <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3">
              <p className="text-[11px] text-indigo-700 font-medium mb-1">Безопасность</p>
              <p className="text-[11px] text-indigo-600 leading-relaxed">
                Данные хранятся локально. Никуда не передаются.
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="flex items-center gap-6 mb-5">
            <div>
              <h1 className="text-foreground">
                {activeCategory === "all"
                  ? "Все сервисы"
                  : CATEGORIES.find((c) => c.id === activeCategory)?.label}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {recordCount(filtered.length)}
                {search ? ` · поиск: "${search}"` : ""}
              </p>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
              <Search size={32} strokeWidth={1.5} />
              <p className="text-sm">Ничего не найдено</p>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[30%]">
                      Сервис
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[25%]">
                      Логин
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[28%]">
                      Пароль
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-[17%]">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((entry) => {
                    const badge = CATEGORY_BADGE[entry.category];
                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary shrink-0">
                              {ICON_MAP[entry.icon] ?? <Globe size={16} />}
                            </div>
                            <div>
                              <p className="text-foreground font-medium leading-tight">{entry.name}</p>
                              {entry.url && (
                                <p className="text-[11px] text-muted-foreground mt-0.5">{entry.url}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span
                              className="text-foreground text-sm"
                              style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                              {entry.login}
                            </span>
                            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full w-fit ${badge.color}`}>
                              {badge.label}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <PasswordCell password={entry.password} />
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setModal({ open: true, entry })}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                              title="Редактировать"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteId(entry.id)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                              title="Удалить"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Modal */}
      {modal.open && (
        <ServiceModal
          entry={modal.entry}
          onClose={() => setModal({ open: false })}
          onSave={handleSave}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-card rounded-xl shadow-2xl w-full max-w-sm p-6 border border-border">
            <h3 className="text-foreground mb-2">Удалить запись?</h3>
            <p className="text-sm text-muted-foreground mb-5">
              Вы удалите запись{" "}
              <span className="font-medium text-foreground">{deleteEntry?.name}</span>.{" "}
              Это действие нельзя отменить.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:opacity-90 transition-opacity"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
