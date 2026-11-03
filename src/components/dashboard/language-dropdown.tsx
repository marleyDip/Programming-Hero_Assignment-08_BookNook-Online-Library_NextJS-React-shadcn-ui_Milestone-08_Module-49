"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Languages, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface LanguageDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function LanguageDropdown({
  value,
  onChange,
  options,
}: LanguageDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((language) =>
    language.toLowerCase().includes(search.toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (open) {
      searchRef.current?.focus();
    }
  }, [open]);

  const selectLanguage = (language: string) => {
    onChange(language);
    setSearch("");
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <label
        htmlFor="language-trigger"
        className="mb-2 block text-sm font-medium"
      >
        Language
      </label>

      {/* Trigger */}
      <button
        id="language-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (open) setSearch("");
          setOpen((prev) => !prev);
        }}
        /* className={cn(
          "group flex h-12 w-full items-center gap-3 rounded-xl border bg-background/60 px-4 text-left transition-all duration-300",
          open
            ? "border-emerald-500 ring-4 ring-emerald-500/15"
            : "border-border hover:border-emerald-500/40",
        )} */

        className={cn(
          "group relative flex h-12 w-full items-center gap-3 rounded-xl border px-4 text-left",
          "bg-background/60 backdrop-blur-md transition-all duration-300",
          open
            ? "border-emerald-500/60 ring-4 ring-emerald-500/10"
            : "border-border/80 hover:border-emerald-500/40 hover:bg-emerald-500/3",
        )}
      >
        <Languages
          className={cn(
            "size-4.5 shrink-0 transition-colors",
            open
              ? "text-emerald-500"
              : "text-muted-foreground group-hover:text-emerald-500",
          )}
        />

        <span className="min-w-0 flex-1 truncate text-sm font-medium">
          {value || "Select language"}
        </span>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180 text-emerald-500",
          )}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            // initial={{ opacity: 0, y: -8, scale: 0.98 }}
            // animate={{ opacity: 1, y: 0, scale: 1 }}
            // exit={{ opacity: 0, y: -8, scale: 0.98 }}
            // transition={{ duration: 0.2, ease: "easeOut" }}
            // className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border/80 bg-popover/95 shadow-2xl shadow-black/10 backdrop-blur-xl"

            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-border/80 bg-popover/95 shadow-2xl shadow-black/10 backdrop-blur-xl"

            // className={cn(
            //   "absolute left-0 right-0 top-[calc(100%+8px)] z-50",
            //   "overflow-hidden rounded-2xl border border-white/40 dark:border-white/10",
            //   "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-2xl",
            //   "shadow-xl shadow-black/6 dark:shadow-black/30",
            // )}
          >
            {/* Subtle top accent */}
            <div className="h-px bg-linear-to-r from-transparent via-emerald-500/60 to-transparent" />

            {/* Search */}
            <div className="border-b border-border/70 p-3">
              <div className="flex h-10 items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-3 transition-colors focus-within:border-emerald-500/60">
                <Search className="size-4 shrink-0 text-muted-foreground" />

                <input
                  ref={searchRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search language..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Options */}
            <div
              role="listbox"
              aria-label="Select language"
              className="max-h-56 overflow-y-auto p-2 scrollbar-hide"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((language) => {
                  const selected = value === language;

                  return (
                    <button
                      key={language}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => selectLanguage(language)}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-xl my-1.5 px-3 py-2.5 text-left text-sm transition-all duration-200",
                        selected
                          ? "bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
                          : "text-foreground hover:bg-muted/80",
                      )}
                    >
                      <span>{language}</span>

                      <AnimatePresence>
                        {selected && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                          >
                            <Check className="size-4 text-emerald-500" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-8 text-center">
                  <Languages className="mx-auto mb-2 size-6 text-muted-foreground/50" />
                  <p className="text-sm font-medium">No language found</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try another search keyword.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-border/70 bg-muted/30 px-4 py-2">
              <p className="text-[11px] text-muted-foreground">
                {filteredOptions.length} languages available
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 3d Design
// "use client";

// import { AnimatePresence, motion } from "framer-motion";
// import { Check, ChevronDown, Languages, Search, Sparkles } from "lucide-react";
// import { useEffect, useRef, useState } from "react";

// import { cn } from "@/lib/utils";

// interface LanguageDropdownProps {
//   value: string;
//   onChange: (value: string) => void;
//   options: string[];
// }

// export default function LanguageDropdown({
//   value,
//   onChange,
//   options,
// }: LanguageDropdownProps) {
//   const [open, setOpen] = useState(false);
//   const [search, setSearch] = useState("");

//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const searchRef = useRef<HTMLInputElement>(null);

//   const filteredOptions = options.filter((language) =>
//     language.toLowerCase().includes(search.toLowerCase()),
//   );

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setOpen(false);
//       }
//     };

//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === "Escape") setOpen(false);
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEscape);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEscape);
//     };
//   }, []);

//   useEffect(() => {
//     if (open) searchRef.current?.focus();
//     else setSearch("");
//   }, [open]);

//   const selectLanguage = (language: string) => {
//     onChange(language);
//     setOpen(false);
//   };

//   return (
//     <div ref={dropdownRef} className="relative">
//       <label
//         htmlFor="language-trigger"
//         className="mb-2.5 flex items-center gap-2 text-sm font-semibold tracking-wide"
//       >
//         <Languages className="size-4 text-emerald-500" />
//         Language
//         <span className="text-xs font-normal text-muted-foreground">
//           (Required)
//         </span>
//       </label>

//       {/* 3D Trigger */}
//       <motion.button
//         id="language-trigger"
//         type="button"
//         aria-haspopup="listbox"
//         aria-expanded={open}
//         onClick={() => setOpen((prev) => !prev)}
//         whileHover={{ y: -2 }}
//         whileTap={{ scale: 0.985 }}
//         className={cn(
//           "group relative flex h-14 w-full items-center gap-3 overflow-hidden rounded-2xl border px-4 text-left",
//           "bg-gradient-to-br from-background via-background to-emerald-500/[0.04]",
//           "shadow-[0_4px_12px_rgba(0,0,0,0.04),0_10px_25px_rgba(16,185,129,0.04)]",
//           "transition-all duration-300",
//           open
//             ? "border-emerald-500/70 shadow-[0_0_0_4px_rgba(16,185,129,0.10),0_12px_30px_rgba(16,185,129,0.12)]"
//             : "border-border/80 hover:border-emerald-500/50 hover:shadow-[0_12px_30px_rgba(16,185,129,0.10)]",
//         )}
//       >
//         {/* Background glow */}
//         <span
//           className={cn(
//             "pointer-events-none absolute -right-8 -top-12 size-32 rounded-full bg-emerald-500/10 blur-3xl transition-opacity duration-500",
//             open ? "opacity-100" : "opacity-0 group-hover:opacity-100",
//           )}
//         />

//         <span className="relative grid size-9 shrink-0 place-items-center rounded-xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-teal-500/5 shadow-inner">
//           <Languages className="size-4.5 text-emerald-600 dark:text-emerald-400" />
//         </span>

//         <span className="relative min-w-0 flex-1">
//           <span className="block text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
//             Selected language
//           </span>
//           <span className="mt-0.5 block truncate text-sm font-semibold">
//             {value || "Choose a language"}
//           </span>
//         </span>

//         <span className="relative grid size-8 shrink-0 place-items-center rounded-xl bg-muted/70 transition-colors group-hover:bg-emerald-500/10">
//           <motion.span
//             animate={{ rotate: open ? 180 : 0 }}
//             transition={{ type: "spring", stiffness: 250, damping: 18 }}
//           >
//             <ChevronDown className="size-4 text-muted-foreground group-hover:text-emerald-500" />
//           </motion.span>
//         </span>
//       </motion.button>

//       {/* 3D Floating Dropdown */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{
//               opacity: 0,
//               y: -15,
//               scale: 0.94,
//               rotateX: -12,
//             }}
//             animate={{
//               opacity: 1,
//               y: 0,
//               scale: 1,
//               rotateX: 0,
//             }}
//             exit={{
//               opacity: 0,
//               y: -10,
//               scale: 0.96,
//               rotateX: -8,
//             }}
//             transition={{
//               type: "spring",
//               stiffness: 300,
//               damping: 24,
//             }}
//             style={{
//               transformPerspective: 1000,
//               transformOrigin: "top center",
//             }}
//             className={cn(
//               "absolute left-0 right-0 top-[calc(100%+12px)] z-50",
//               "overflow-hidden rounded-2xl border border-emerald-500/20",
//               "bg-popover/95 backdrop-blur-2xl",
//               "shadow-[0_8px_15px_rgba(0,0,0,0.05),0_25px_60px_rgba(0,0,0,0.15),0_0_35px_rgba(16,185,129,0.10)]",
//             )}
//           >
//             {/* Top gradient accent */}
//             <div className="h-1 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-400" />

//             {/* Search header */}
//             <div className="border-b border-border/60 bg-gradient-to-br from-emerald-500/[0.06] to-transparent p-3.5">
//               <div className="mb-2 flex items-center justify-between">
//                 <span className="text-xs font-semibold tracking-wide">
//                   Choose your language
//                 </span>
//                 <Sparkles className="size-3.5 text-emerald-500" />
//               </div>

//               <div className="group flex h-11 items-center gap-2.5 rounded-xl border border-border/70 bg-background/80 px-3 shadow-inner transition-all duration-300 focus-within:border-emerald-500/60 focus-within:shadow-[0_0_0_3px_rgba(16,185,129,0.10)]">
//                 <Search className="size-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-emerald-500" />

//                 <input
//                   ref={searchRef}
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search languages..."
//                   className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
//                 />

//                 {search && (
//                   <button
//                     type="button"
//                     onClick={() => setSearch("")}
//                     className="text-xs font-medium text-emerald-600 hover:text-emerald-500"
//                   >
//                     Clear
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Language options */}
//             <div
//               role="listbox"
//               aria-label="Choose language"
//               className="max-h-60 space-y-1 overflow-y-auto p-2.5"
//             >
//               {filteredOptions.length > 0 ? (
//                 filteredOptions.map((language, index) => {
//                   const selected = value === language;

//                   return (
//                     <motion.button
//                       key={language}
//                       type="button"
//                       role="option"
//                       aria-selected={selected}
//                       initial={{ opacity: 0, x: -8 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       transition={{
//                         delay: Math.min(index * 0.025, 0.2),
//                         duration: 0.2,
//                       }}
//                       whileHover={{
//                         x: 3,
//                         scale: 1.01,
//                       }}
//                       whileTap={{ scale: 0.98 }}
//                       onClick={() => selectLanguage(language)}
//                       className={cn(
//                         "group/item relative flex w-full items-center justify-between overflow-hidden rounded-xl px-3.5 py-3 text-left transition-colors duration-200",
//                         selected
//                           ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
//                           : "text-foreground hover:bg-muted/80",
//                       )}
//                     >
//                       {/* Selected background glow */}
//                       {selected && (
//                         <motion.span
//                           layoutId="selected-language-bg"
//                           className="absolute inset-0 rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/[0.08] to-transparent"
//                           transition={{
//                             type: "spring",
//                             stiffness: 350,
//                             damping: 30,
//                           }}
//                         />
//                       )}

//                       <span className="relative flex items-center gap-3">
//                         <span
//                           className={cn(
//                             "grid size-7 place-items-center rounded-lg transition-all duration-300",
//                             selected
//                               ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
//                               : "bg-muted text-muted-foreground group-hover/item:bg-emerald-500/10 group-hover/item:text-emerald-500",
//                           )}
//                         >
//                           {selected ? (
//                             <Check className="size-3.5" />
//                           ) : (
//                             <Languages className="size-3.5" />
//                           )}
//                         </span>

//                         <span className="text-sm font-medium">{language}</span>
//                       </span>

//                       {selected && (
//                         <motion.span
//                           initial={{ opacity: 0, scale: 0.5 }}
//                           animate={{ opacity: 1, scale: 1 }}
//                           className="relative rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
//                         >
//                           Selected
//                         </motion.span>
//                       )}
//                     </motion.button>
//                   );
//                 })
//               ) : (
//                 <div className="flex flex-col items-center px-4 py-8 text-center">
//                   <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-muted">
//                     <Search className="size-5 text-muted-foreground" />
//                   </span>
//                   <p className="text-sm font-semibold">No language found</p>
//                   <p className="mt-1 text-xs text-muted-foreground">
//                     Try searching with another keyword.
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Footer */}
//             <div className="flex items-center justify-between border-t border-border/60 bg-muted/30 px-4 py-3">
//               <span className="text-[11px] text-muted-foreground">
//                 {filteredOptions.length} languages available
//               </span>
//               <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
//                 <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
//                 BookNook Library
//               </span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
