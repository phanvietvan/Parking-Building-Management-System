from pathlib import Path
import re

p = Path(__file__).resolve().parents[1] / "src" / "pages" / "StaffDashboard.tsx"
t = p.read_text(encoding="utf-8")
t = t.replace("</motionless>", "</div>")
t = t.replace('<motionless />', '<div className="text-right hidden sm:block">')
t = re.sub(
    r"\{LottieComp && \(\s*<LottieComp[\s\S]*?\)\s*\}",
    """<motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center"
                          >
                            <CheckCircle2 className="text-white w-20 h-20" strokeWidth={1.5} />
                          </motion.div>""",
    t,
)
t = t.replace("export default App;", "export default StaffDashboard;")
p.write_text(t, encoding="utf-8")
print("fixed", p)
