import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as acorn from 'acorn';
import { ESLint } from 'eslint';

const app = express();
const PORT = 3001;


app.use(cors());
app.use(bodyParser.json());


const extractSecurityVulnerabilities = (code) => {
  const issues = [];


  if (/\beval\s*\(/.test(code)) {
    issues.push({
      type: 'Use of eval',
      message: 'The use of eval is dangerous and can lead to code injection.',
      suggestion: 'Avoid using eval. Use JSON.parse or switch-case logic.',
    });
  }

  if (/select\s+.*\s+from\s+.*where\s+.*[=><]\s*["'`]/i.test(code) || /\+\s*req\.(query|body|params)\./.test(code)) {
    issues.push({
      type: 'Potential SQL Injection',
      message: 'Detected string concatenation for SQL queries.',
      suggestion: 'Use parameterized queries or ORM methods.',
    });
  }


  if (/document\.write\s*\(/.test(code) || /\.innerHTML\s*=\s*/.test(code)) {
    issues.push({
      type: 'XSS Vulnerability',
      message: 'Direct DOM manipulation can lead to XSS attacks.',
      suggestion: 'Use safe DOM APIs or libraries, and sanitize input.',
    });
  }

  if (/(['"])sk_live_[a-z0-9]{10,}/i.test(code) || /(['"])?api[_-]?key(['"])?.{0,10}[:=]\s*['"][a-z0-9_\-]{10,}/i.test(code)) {
    issues.push({
      type: 'Hardcoded Secret/API Key',
      message: 'Detected hardcoded API key or secret.',
      suggestion: 'Store secrets securely using environment variables.',
    });
  }

  if (/Math\.random\(\)\s*\.toString\s*\(/.test(code)) {
    issues.push({
      type: 'Insecure Random',
      message: 'Math.random is not suitable for cryptographic purposes.',
      suggestion: 'Use crypto.randomBytes for secure token generation.',
    });
  }

  if (/new Function\s*\(|eval\s*\(/.test(code)) {
    issues.push({
      type: 'Insecure Deserialization',
      message: 'Dynamic code execution detected.',
      suggestion: 'Avoid using dynamic functions or eval().',
    });
  }

  if (/exec\s*\(\s*.*(req\.body|req\.query|req\.params)/.test(code)) {
    issues.push({
      type: 'Command Injection',
      message: 'Executing shell commands with user input is dangerous.',
      suggestion: 'Sanitize input and use spawn with safe arguments.',
    });
  }


  if (/res\.redirect\s*\(\s*req\.(query|body|params)\./.test(code)) {
    issues.push({
      type: 'Open Redirect',
      message: 'Redirect based on untrusted input detected.',
      suggestion: 'Validate redirect URLs against a whitelist.',
    });
  }

  if (/app\.post\(['"][^'"]*login[^'"]*['"],/.test(code) && !/express-rate-limit/.test(code)) {
    issues.push({
      type: 'No Rate Limiting',
      message: 'Login route missing rate limiting protection.',
      suggestion: 'Use express-rate-limit to mitigate brute-force attacks.',
    });
  }

  
  if (/req\.body\.(\w+)/.test(code) && !/(express-validator|joi|yup)/i.test(code)) {
    issues.push({
      type: 'Missing Input Validation',
      message: 'Input detected without proper validation.',
      suggestion: 'Validate inputs using express-validator, Joi, or Yup.',
    });
  }

  return issues;
};


const analyzePerformance = (code) => {
  const suggestions = [];

  if (/for\s*\(.*\)\s*{[^}]*\.push\(/.test(code)) {
    suggestions.push({
      category: 'Memory Usage',
      issue: 'Array push inside a loop may impact performance.',
      recommendation: 'Use map, reduce, or preallocate arrays.',
    });
  }

  if (/while\s*\(\s*true\s*\)/.test(code)) {
    suggestions.push({
      category: 'Infinite Loop Risk',
      issue: 'while(true) may block event loop.',
      recommendation: 'Add a valid break or exit condition.',
    });
  }

  return suggestions;
};


app.post('/api/analyze-code', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required.' });

  const linter = new ESLint({
    overrideConfig: {
      env: { browser: true, node: true, es2021: true },
      extends: ['eslint:recommended'],
      rules: {
        'no-eval': 'error',
        'no-unused-vars': 'warn',
        'no-undef': 'warn',
        'no-console': 'warn',
      },
    },
    fix: true,
  });

  try {
    const results = await linter.lintText(code);
    const result = results[0];

    const errors = result.messages.map((msg) => ({
      type: msg.ruleId || 'Unknown Rule',
      message: msg.message,
      line: msg.line,
      suggestion: {
        'no-eval': 'Avoid using eval. Consider JSON.parse or logic-based decisions.',
        'no-unused-vars': 'Remove unused variables.',
        'no-undef': 'Declare or import missing variable.',
        'no-console': 'Remove console logs in production.',
      }[msg.ruleId] || 'Follow best practices.',
    }));

    res.json({
      errors,
      optimizedCode: result.output || code,
      wasFixed: !!result.output,
    });
  } catch (error) {
    console.error('❌ ESLint error:', error);
    res.status(500).json({ error: 'Error analyzing code.' });
  }
});


app.post('/api/analyze-security', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required.' });

  const vulnerabilities = extractSecurityVulnerabilities(code);
  res.json({ vulnerabilities });
});


app.post('/api/analyze-performance', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required.' });

  const suggestions = analyzePerformance(code);
  res.json({ suggestions });
});


app.listen(PORT, () => {
  console.log(`✅ Analyzer backend running at http://localhost:${PORT}`);
});
