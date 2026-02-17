'use client';

import { useState, useRef } from 'react';
import { Upload, Database, AlertCircle, CheckCircle2, Info, AlertTriangle, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export function FlywayMigrationPage() {
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock server list
  const servers = [
    { id: 'prod-db-01', name: 'Production DB 01 (MySQL 8.0)' },
    { id: 'staging-db-01', name: 'Staging DB 01 (PostgreSQL 15)' },
    { id: 'dev-db-01', name: 'Development DB 01 (MySQL 8.0)' },
    { id: 'test-db-01', name: 'Test DB 01 (PostgreSQL 15)' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const sqlFile = files.find(file => file.name.endsWith('.sql'));

    if (sqlFile) {
      setUploadedFile(sqlFile);
    } else {
      addLog('error', 'Invalid file type. Please upload a .sql file.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.sql')) {
      setUploadedFile(file);
    } else if (file) {
      addLog('error', 'Invalid file type. Please upload a .sql file.');
    }
  };

  const addLog = (type: LogEntry['type'], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs(prev => [...prev, newLog]);
  };

  const runMigration = async () => {
    if (!selectedServer) {
      addLog('error', 'Please select a target server before running migration.');
      return;
    }

    if (!uploadedFile) {
      addLog('error', 'Please upload a SQL file before running migration.');
      return;
    }

    setIsRunning(true);
    addLog('info', `Starting Flyway migration on ${servers.find(s => s.id === selectedServer)?.name}...`);
    addLog('info', `Processing file: ${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(2)} KB)`);

    // Simulate migration process
    setTimeout(() => {
      addLog('info', 'Validating SQL syntax...');
    }, 500);

    setTimeout(() => {
      addLog('success', 'SQL syntax validation passed.');
    }, 1200);

    setTimeout(() => {
      addLog('info', 'Checking migration history...');
    }, 1800);

    setTimeout(() => {
      addLog('info', 'Migration version: V1__initial_schema.sql');
    }, 2400);

    setTimeout(() => {
      addLog('warning', 'This migration will modify 3 tables and create 2 new indexes.');
    }, 3000);

    setTimeout(() => {
      addLog('info', 'Executing migration script...');
    }, 3500);

    setTimeout(() => {
      addLog('success', 'Migration completed successfully!');
      addLog('info', 'Affected rows: 1,247');
      addLog('info', 'Execution time: 2.3 seconds');
      setIsRunning(false);
    }, 5000);
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="size-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="size-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="size-4 text-yellow-500" />;
      case 'info':
      default:
        return <Info className="size-4 text-blue-500" />;
    }
  };

  const getLogBadgeVariant = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'info':
      default:
        return 'secondary';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Database className="size-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Flyway Migration Manager</h1>
            <p className="text-gray-600">Upload and execute SQL migration scripts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Target Server Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Target Server</CardTitle>
                <CardDescription>Select the database server for migration</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={selectedServer} onValueChange={setSelectedServer}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a target server..." />
                  </SelectTrigger>
                  <SelectContent>
                    {servers.map(server => (
                      <SelectItem key={server.id} value={server.id}>
                        <div className="flex items-center gap-2">
                          <Database className="size-4" />
                          {server.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* SQL File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>SQL Migration File</CardTitle>
                <CardDescription>Upload a .sql file for migration</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".sql"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Upload className="size-12 mx-auto mb-4 text-gray-400" />
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUploadedFile(null);
                        }}
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Drag & drop your SQL file here
                      </p>
                      <p className="text-xs text-gray-500">or click to browse</p>
                      <p className="text-xs text-gray-400 mt-2">Only .sql files accepted</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Run Migration Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={runMigration}
                  disabled={!selectedServer || !uploadedFile || isRunning}
                >
                  <Play className="size-4 mr-2" />
                  {isRunning ? 'Running Migration...' : 'Run Migration'}
                </Button>
                {(!selectedServer || !uploadedFile) && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Please select a server and upload a SQL file
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Migration Log */}
          <Card className="lg:row-span-3">
            <CardHeader>
              <CardTitle>Migration Log</CardTitle>
              <CardDescription>Real-time execution logs and status updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Info className="size-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No migration logs yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Upload a file and run migration to see logs
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logs.map(log => (
                      <div
                        key={log.id}
                        className="flex gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200"
                      >
                        <div className="flex-shrink-0 mt-0.5">{getLogIcon(log.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={getLogBadgeVariant(log.type)} className="text-xs">
                              {log.type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-gray-500">{log.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700 break-words">{log.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}