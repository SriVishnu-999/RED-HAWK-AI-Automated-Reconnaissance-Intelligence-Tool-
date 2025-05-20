import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Shield,
  Code,
  LogOut,
  AlertTriangle,
  TrendingUp,
  FileDown,
  Sun,
  Moon,
  ArrowRightCircle,
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './styles.css';

const AnalyzerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'code' | 'security' | 'performance'>('code');
  const [code, setCode] = useState('');
  const [codeAnalysis, setCodeAnalysis] = useState<any>(null);
  const [securityAnalysis, setSecurityAnalysis] = useState<any>(null);
  const [selectedVuln, setSelectedVuln] = useState<any>(null);
  const [analyzingPerformance, setAnalyzingPerformance] = useState(false);
  const [performanceResults, setPerformanceResults] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isAnalyzingCode, setIsAnalyzingCode] = useState(false);
  const [isScanningSecurity, setIsScanningSecurity] = useState(false);
  const navigate = useNavigate();

  const analyzeCode = async () => {
    setIsAnalyzingCode(true);
    try {
      const response = await fetch('http://localhost:3001/api/analyze-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setCodeAnalysis(data);
    } catch (error) {
      console.error('Error analyzing code:', error);
    } finally {
      setIsAnalyzingCode(false);
    }
  };

  const analyzeSecurity = async () => {
    setIsScanningSecurity(true);
    try {
      const response = await fetch('http://localhost:3001/api/analyze-security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setSecurityAnalysis(data);
      setSelectedVuln(null);
    } catch (error) {
      console.error('Error analyzing security:', error);
    } finally {
      setIsScanningSecurity(false);
    }
  };

  const analyzePerformance = () => {
    setAnalyzingPerformance(true);
    setTimeout(() => {
      setPerformanceResults({
        suggestions: [
          {
            category: 'Memory Usage',
            issue: 'Large memory allocation in loop',
            impact: 'High',
            location: 'src/utils/dataProcessor.js:78',
            recommendation: 'Use batch processing or streaming for large data sets',
            potentialGain: '60% memory reduction',
          },
        ],
      });
      setAnalyzingPerformance(false);
    }, 1500);
  };

  const exportReportAsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Security Vulnerability Report', 20, 20);
    let y = 30;

    if (securityAnalysis?.vulnerabilities?.length) {
      securityAnalysis.vulnerabilities.forEach((vuln: any, index: number) => {
        doc.text(`${index + 1}. ${vuln.type}`, 20, y += 8);
        doc.text(`   Message: ${vuln.message}`, 20, y += 8);
        doc.text(`   Suggestion: ${vuln.suggestion}`, 20, y += 8);
      });
    } else {
      doc.text('No vulnerabilities found.', 20, y);
    }

    doc.save('security-report.pdf');
  };

  const summaryStats = [
    { label: 'Errors', count: codeAnalysis?.errors?.length || 0 },
    { label: 'Vulnerabilities', count: securityAnalysis?.vulnerabilities?.length || 0 },
    { label: 'Performance Tips', count: performanceResults?.suggestions?.length || 0 },
  ];

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} flex h-screen`}>

      <div className="w-64 p-5 border-r space-y-4 bg-opacity-30">
        <h2 className="text-xl font-bold">RedHawk AI</h2>
        <nav className="space-y-2">
          <button onClick={() => setActiveTab('code')} className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'code' ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 text-gray-500'}`}>
            <Code className="w-5 h-5 mr-2" /> Code Analysis
          </button>
          <button onClick={() => setActiveTab('security')} className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'security' ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 text-gray-500'}`}>
            <Shield className="w-5 h-5 mr-2" /> Security Scan
          </button>
          <button onClick={() => setActiveTab('performance')} className={`flex items-center w-full p-2 rounded-lg ${activeTab === 'performance' ? 'bg-purple-600 text-white' : 'hover:bg-purple-100 text-gray-500'}`}>
            <Zap className="w-5 h-5 mr-2" /> Performance
          </button>
        </nav>
        <hr />
        <div className="flex gap-3">
          <button onClick={exportReportAsPDF} className="flex items-center gap-1 bg-green-600 px-2 py-1 text-sm rounded text-white">
            <FileDown className="w-4 h-4" /> Export
          </button>
        </div>
        <div className="pt-4">
          <button onClick={() => setDarkMode(!darkMode)} className="flex items-center text-sm">
            {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
        <button onClick={() => navigate('/')} className="flex items-center text-sm mt-10 text-red-500">
          <LogOut className="w-4 h-4 mr-2" /> Logout
        </button>
      </div>

   
      <div className="flex-1 p-6 overflow-y-auto grid grid-cols-3 gap-4">
     
        <div className="col-span-2">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {summaryStats.map((s, i) => (
              <div key={i} className="rounded-lg bg-purple-700 bg-opacity-80 p-4 text-white shadow-md">
                <h4 className="text-sm">{s.label}</h4>
                <p className="text-xl font-bold">{s.count}</p>
              </div>
            ))}
          </div>

          <Editor
            height="300px"
            defaultLanguage="javascript"
            theme={darkMode ? 'vs-dark' : 'light'}
            value={code}
            onChange={(value) => setCode(value || '')}
          />

          <div className="mt-6 space-y-4">
            {activeTab === 'code' && (
              <>
                <button onClick={analyzeCode} disabled={isAnalyzingCode} className="px-4 py-2 bg-purple-600 text-white rounded-lg">
                  {isAnalyzingCode ? 'Analyzing Code...' : 'Run Code Analysis'}
                </button>
                {codeAnalysis?.errors?.map((error: any, i: number) => (
                  <div key={i} className="border p-3 rounded bg-red-800 bg-opacity-40 hover:scale-[1.01] transition">
                    <AlertTriangle className="inline-block w-5 h-5 text-red-400 mr-2" />
                    <strong>{error.type}:</strong> {error.message}
                    <p className="text-sm text-gray-300">Suggestion: {error.suggestion}</p>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'security' && (
              <>
                <button onClick={analyzeSecurity} disabled={isScanningSecurity} className="px-4 py-2 bg-red-600 text-white rounded-lg">
                  {isScanningSecurity ? 'Scan in Progress...' : 'Scan for Vulnerabilities'}
                </button>
                {securityAnalysis?.vulnerabilities?.map((vuln: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => setSelectedVuln(vuln)}
                    className="cursor-pointer border p-3 rounded bg-yellow-800 bg-opacity-40 hover:bg-yellow-700 hover:bg-opacity-70 transition"
                  >
                    <Shield className="inline-block w-5 h-5 text-yellow-300 mr-2" />
                    <strong>{vuln.type}:</strong> {vuln.message}
                    <p className="text-sm">Click to view fix</p>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'performance' && (
              <>
                <button onClick={analyzePerformance} disabled={analyzingPerformance} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  {analyzingPerformance ? 'Analyzing...' : 'Analyze Performance'}
                </button>
                {performanceResults?.suggestions?.map((tip: any, index: number) => (
                  <div key={index} className="border p-3 rounded bg-blue-800 bg-opacity-50">
                    <TrendingUp className="inline-block w-5 h-5 text-blue-300 mr-2" />
                    <strong>{tip.category}:</strong> {tip.issue}
                    <p className="text-sm">Recommendation: {tip.recommendation}</p>
                    <p className="text-sm">Location: {tip.location}</p>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

    
        <div className="col-span-1 p-4 rounded-lg border bg-gray-100 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <ArrowRightCircle className="w-5 h-5 mr-2" /> Fix Suggestions
          </h3>
          {selectedVuln ? (
            <div>
              <p className="font-semibold">{selectedVuln.type}</p>
              <p className="text-sm text-red-200 mb-2">{selectedVuln.message}</p>
              <p className="text-sm text-green-300">Suggested Fix: {selectedVuln.suggestion}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Select a vulnerability to view more info.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzerDashboard;
