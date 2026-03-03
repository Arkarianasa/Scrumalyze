<h1>SCRUMalyze – Agile Evaluation Tool</h1>

<p><strong>SCRUMalyze</strong> is a web-based application designed to evaluate software development processes based on the SCRUM framework. It supports structured data input, automated analysis using Groovy scripts, and clear visualization of evaluation results.</p>

<hr />

<h2>Main Features</h2>
<ul>
  <li>Multi-step wizard for structured team data entry</li>
  <li>REST API for data access and evaluation triggers</li>
  <li>Modular evaluation logic via Groovy (easily extendable)</li>
  <li>Context-based state management in React (GlobalContext, TeamContext)</li>
  <li>Dynamic dashboard with tabbed views (results, metadata, work items, issues)</li>
</ul>
<h2>Requirements</h2>
<ul>
  <li>.NET 8 SDK</li>
  <li>Node.js 18+ (for frontend)</li>
  <li>SQL Server instance (local or remote)</li>
  <li>Visual Studio 2022 (recommended for development)</li>
  <li>Java</li>
  <li>Groovy SDK</li>
</ul>

<h2>Configuration</h2>
<p>Create a file called <code>appsettings.json</code> in the backend root with the following structure:</p>
<pre><code>{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=Scrumalyze;Trusted_Connection=True;"
  }
}
</code></pre>

<h2>Running the App</h2>

<h3>Backend (C#/.NET)</h3>
<ol>
  <li>Open the solution in Visual Studio</li>
  <li>Run the API project</li>
</ol>

<h3>Frontend (React)</h3>
<ol>
  <li>Navigate to the <code>ClientApp</code> directory</li>
  <li>Install dependencies: <code>npm install</code></li>
  <li>Start the development server: <code>npm start</code></li>
</ol>

<p>Visit <a href="http://localhost:3000">http://localhost:3000</a> in your browser.</p>

<h2>Evaluation Logic</h2>
<p>Evaluation logic is handled via Groovy scripts. Each script is independent and returns a JSON result based on team data (serialized on the backend). New checks can be added without touching application logic – simply by placing new scripts in the Tests directory.</p>
