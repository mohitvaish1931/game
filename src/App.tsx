@@ .. @@
 import React from 'react';
+import GameApp from './ui/App';

 function App() {
   return (
-    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
-      <p>Start prompting (or editing) to see magic happen :)</p>
-    </div>
+    <GameApp />
   );
 }

 export default App;