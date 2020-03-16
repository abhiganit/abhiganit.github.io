(TeX-add-style-hook
 "Abhishek_CV"
 (lambda ()
   (TeX-add-to-alist 'LaTeX-provided-class-options
                     '(("res" "margin" "line" "pifont" "palatino" "courier")))
   (TeX-add-to-alist 'LaTeX-provided-package-options
                     '(("hyperref" "hidelinks")))
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "path")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "url")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "nolinkurl")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperbaseurl")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperimage")
   (add-to-list 'LaTeX-verbatim-macros-with-braces-local "hyperref")
   (add-to-list 'LaTeX-verbatim-macros-with-delims-local "url")
   (add-to-list 'LaTeX-verbatim-macros-with-delims-local "path")
   (TeX-run-style-hooks
    "latex2e"
    "res"
    "res10"
    "hyperref"
    "wasysym"
    "marvosym"
    "fancyhdr")
   (TeX-add-symbols
    '("doi" 1)
    '("doilink" 1))
   (LaTeX-add-environments
    "list")))

