# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
shopt -s expand_aliases
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  function rg {
  local _cc_bin="${CLAUDE_CODE_EXECPATH:-}"
  [[ -x $_cc_bin ]] || _cc_bin=/c/Users/LENOVO/.local/bin/claude.exe
  if [[ ! -x $_cc_bin ]]; then command rg "$@"; return; fi
  if [[ -n $ZSH_VERSION ]]; then
    ARGV0=rg "$_cc_bin" "$@"
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    ARGV0=rg "$_cc_bin" "$@"
  elif [[ $BASHPID != $$ ]]; then
    exec -a rg "$_cc_bin" "$@"
  else
    (exec -a rg "$_cc_bin" "$@")
  fi
}
fi
export PATH='/c/Users/LENOVO/bin:/mingw64/bin:/usr/local/bin:/usr/bin:/bin:/mingw64/bin:/usr/bin:/c/Users/LENOVO/bin:/c/Python314/Scripts:/c/Python314:/c/Program Files/Common Files/Oracle/Java/javapath:/c/Program Files (x86)/Common Files/Oracle/Java/java8path:/c/Program Files (x86)/Common Files/Oracle/Java/javapath:/c/WINDOWS/system32:/c/WINDOWS:/c/WINDOWS/System32/Wbem:/c/WINDOWS/System32/WindowsPowerShell/v1.0:/c/WINDOWS/System32/OpenSSH:/c/Program Files/nodejs:/c/ProgramData/chocolatey/bin:/c/Users/LENOVO/AppData/Local/Microsoft/WindowsApps:/c/Users/LENOVO/AppData/Local/Programs/Microsoft VS Code/bin:/c/Users/LENOVO/AppData/Local/Python/bin:/c/Users/LENOVO/AppData/Roaming/npm:/c/Program Files/PostgreSQL/18/bin:/cmd:/c/Users/LENOVO/AppData/Local/Microsoft/WindowsApps:/c/Users/LENOVO/AppData/Local/Programs/Microsoft VS Code/bin:/c/Users/LENOVO/AppData/Local/Python/bin:/c/Users/LENOVO/AppData/Roaming/npm:/c/Users/LENOVO/AppData/Local/Microsoft/WinGet/Packages/oschwartz10612.Poppler_Microsoft.Winget.Source_8wekyb3d8bbwe/poppler-25.07.0/Library/bin:/usr/bin/vendor_perl:/usr/bin/core_perl'
