from pathlib import Path

JSX = r'''  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <motionless />
    </main>
  );
};
'''

# Replace placeholder tag with real UI
UI = r'''  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <motionless />
    </main>
  );
};
'''

UI = UI.replace("<motionless />", """<div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[40%] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-panel-heavy rounded-[40px] p-10 shadow-2xl border-primary/10">
          <motionless />
        </div>
      </motion.div>""")

UI = UI.replace("<motionless />", """<motionless />""")
