import React from 'react';

interface AttackTreeProps {
  vulnerabilities: Array<{
    type: string;
    message: string;
    suggestion: string;
  }>;
}

export const AttackTree: React.FC<AttackTreeProps> = ({ vulnerabilities }) => {
  // Safe mapping of vulnerabilities to mock compromise nodes
  const nodes = [
    { id: 'vector', label: 'HTTP Input Vector', desc: 'Attacker injects query payloads', type: 'entry', x: 250, y: 50 },
    { id: 'vuln1', label: 'SQL Injection Flagged', desc: 'Unchecked query parameter concatenation', type: 'exploit', x: 130, y: 150, active: vulnerabilities.some(v => v.type?.toLowerCase()?.includes('sql')) },
    { id: 'vuln2', label: 'Command Injection Flagged', desc: 'Shell execution from variable content', type: 'exploit', x: 370, y: 150, active: vulnerabilities.some(v => v.type?.toLowerCase()?.includes('command')) },
    { id: 'vuln3', label: 'XSS Vector Detected', desc: 'Raw injection via innerHTML', type: 'exploit', x: 250, y: 230, active: vulnerabilities.some(v => v.type?.toLowerCase()?.includes('xss')) },
    { id: 'compromise', label: 'Remote Code Execution (RCE)', desc: 'Full interactive shell established', type: 'breach', x: 250, y: 340 }
  ];

  const links = [
    { from: 'vector', to: 'vuln1', active: vulnerabilities.some(v => v.type?.toLowerCase()?.includes('sql')) },
    { from: 'vector', to: 'vuln2', active: vulnerabilities.some(v => v.type?.toLowerCase()?.includes('command')) },
    { from: 'vuln1', to: 'vuln3', active: vulnerabilities.some(v => v.type?.toLowerCase()?.includes('sql') && v.type?.toLowerCase()?.includes('xss')) },
    { from: 'vuln2', to: 'compromise', active: vulnerabilities.some(v => v.type?.toLowerCase()?.includes('command')) },
    { from: 'vuln1', to: 'compromise', active: vulnerabilities.some(v => v.type?.toLowerCase()?.includes('sql')) },
    { from: 'vuln3', to: 'compromise', active: vulnerabilities.some(v => v.type?.toLowerCase()?.includes('xss')) }
  ];

  const getPosition = (id: string) => {
    const node = nodes.find(n => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  const hasAnyVulnerabilities = vulnerabilities.length > 0;

  return (
    <div className="cyber-panel p-6 bg-black/90 border border-[#00ff66]/30 rounded-lg relative overflow-hidden flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-1 flex justify-between">
          <span>THREAT MODEL ATTACK PATH MAP</span>
          <span className={hasAnyVulnerabilities ? "text-[#ef4444] animate-pulse" : "text-[#00ff66]"}>
            STATUS: {hasAnyVulnerabilities ? 'VULNERABILITY DETECTED' : 'SYSTEM TARGET EXCELLENT'}
          </span>
        </h3>
        <p className="text-[11px] text-gray-500 font-sans">
          This model visualizes how detected source code vulnerabilities chain to form an exploitation path.
        </p>
      </div>

      <div className="w-full overflow-x-auto flex justify-center bg-black/60 p-4 border border-[#00ff66]/10 rounded">
        <svg width="500" height="420" className="max-w-full">
          {/* Defs for dynamic gradients / shadows */}
          <defs>
            <marker id="arrow-green" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#00ff66" />
            </marker>
            <marker id="arrow-red" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
            </marker>
            <marker id="arrow-gray" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#2d3748" />
            </marker>
          </defs>

          {/* Draw connecting edges */}
          {links.map((link, idx) => {
            const p1 = getPosition(link.from);
            const p2 = getPosition(link.to);
            const strokeColor = link.active ? '#ef4444' : hasAnyVulnerabilities ? '#2d3748' : '#00ff66';
            const marker = link.active ? 'url(#arrow-red)' : hasAnyVulnerabilities ? 'url(#arrow-gray)' : 'url(#arrow-green)';
            return (
              <g key={idx}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={strokeColor}
                  strokeWidth={link.active ? 2 : 1}
                  strokeDasharray={link.active ? 'none' : '4,4'}
                  markerEnd={marker}
                  className={link.active ? 'animate-[pulse_1.5s_infinite]' : ''}
                />
              </g>
            );
          })}

          {/* Draw nodes */}
          {nodes.map((node) => {
            const isExploitable = node.active || (node.id === 'compromise' && hasAnyVulnerabilities) || (node.id === 'vector');
            const nodeFill = isExploitable ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 255, 102, 0.05)';
            const nodeStroke = isExploitable ? '#ef4444' : '#00ff66';

            return (
              <g key={node.id} className="cursor-help group/node">
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="20"
                  fill={nodeFill}
                  stroke={nodeStroke}
                  strokeWidth="2"
                  className={isExploitable ? 'animate-[pulse_2s_infinite]' : ''}
                />
                
                {/* Node details icon */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill={nodeStroke}
                  className="font-mono font-bold text-xs select-none"
                >
                  {node.id === 'vector' ? 'IN' : node.id === 'compromise' ? 'ROOT' : 'CVE'}
                </text>

                {/* Node Hover tooltips */}
                <text
                  x={node.x}
                  y={node.y - 25}
                  textAnchor="middle"
                  fill="#fff"
                  className="font-sans text-[10px] hidden group-hover/node:block bg-black p-1 fill-white"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 border-t border-[#00ff66]/10 pt-3 text-[11px] text-gray-500 font-sans space-y-1">
        <p className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block animate-pulse"></span>
          Active Compromise Path Node (requires patching target codebase).
        </p>
        <p className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] inline-block"></span>
          Verified Safe Node pathway segment.
        </p>
      </div>
    </div>
  );
};
