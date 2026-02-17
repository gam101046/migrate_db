'use client';

import { useState } from 'react';
import { Database, Download, ArrowRight, PlayCircle, Info, CheckCircle2, AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export function PrismaMigrationPage() {
  const [sourceServer, setSourceServer] = useState<string>('');
  const [targetServer, setTargetServer] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPulling, setIsPulling] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [schemaStatus, setSchemaStatus] = useState<'none' | 'pulled'>('none');

  // Mock server list
  const servers = [
    { id: 'prod-db-01', name: 'Production DB 01 (PostgreSQL 15.2)', env: 'production' },
    { id: 'prod-db-02', name: 'Production DB 02 (MySQL 8.0)', env: 'production' },
    { id: 'staging-db-01', name: 'Staging DB 01 (PostgreSQL 15.2)', env: 'staging' },
    { id: 'staging-db-02', name: 'Staging DB 02 (MySQL 8.0)', env: 'staging' },
    { id: 'dev-db-01', name: 'Development DB 01 (PostgreSQL 15.2)', env: 'development' },
    { id: 'dev-db-02', name: 'Development DB 02 (MySQL 8.0)', env: 'development' },
  ];

  const addLog = (type: LogEntry['type'], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  const handlePullDB = async () => {
    if (!sourceServer) {
      addLog('error', 'Please select a source server before pulling database schema.');
      return;
    }

    setIsPulling(true);
    const serverName = servers.find((s) => s.id === sourceServer)?.name;
    
    addLog('info', `Connecting to source server: ${serverName}`);

    setTimeout(() => {
      addLog('info', 'Authenticating with database server...');
    }, 600);

    setTimeout(() => {
      addLog('success', 'Successfully connected to database.');
    }, 1200);

    setTimeout(() => {
      addLog('info', 'Introspecting database schema...');
    }, 1800);

    setTimeout(() => {
      addLog('info', 'Found 12 tables, 47 columns, 8 relationships');
    }, 2400);

    setTimeout(() => {
      addLog('info', 'Generating Prisma schema file...');
    }, 3000);

    setTimeout(() => {
      addLog('success', 'Schema file generated: prisma/schema.prisma');
      addLog('info', 'Models: User, Post, Comment, Category, Tag, Profile, Session, Settings');
    }, 3600);

    setTimeout(() => {
      addLog('success', 'Database schema pulled successfully!');
      setSchemaStatus('pulled');
      setIsPulling(false);
    }, 4200);
  };

  const handleMigrate = async () => {
    if (!targetServer) {
      addLog('error', 'Please select a target server before running migration.');
      return;
    }

    if (schemaStatus !== 'pulled') {
      addLog('error', 'Please pull database schema first before migrating.');
      return;
    }

    setIsMigrating(true);
    const serverName = servers.find((s) => s.id === targetServer)?.name;

    addLog('info', `Preparing migration for target server: ${serverName}`);

    setTimeout(() => {
      addLog('info', 'Analyzing schema differences...');
    }, 600);

    setTimeout(() => {
      addLog('warning', 'Detected 5 schema changes:');
      addLog('info', '  - Added column: users.phone_number');
      addLog('info', '  - Modified column: posts.created_at (nullable → not null)');
      addLog('info', '  - Added index: idx_users_email');
      addLog('info', '  - Added table: notifications');
      addLog('info', '  - Removed column: sessions.expired');
    }, 1200);

    setTimeout(() => {
      addLog('info', 'Generating migration SQL...');
    }, 2000);

    setTimeout(() => {
      addLog('success', 'Migration file created: 20260217_update_schema.sql');
    }, 2600);

    setTimeout(() => {
      addLog('info', 'Applying migrations to database...');
    }, 3200);

    setTimeout(() => {
      addLog('info', 'Running pre-migration checks...');
    }, 3800);

    setTimeout(() => {
      addLog('success', 'Pre-migration checks passed.');
    }, 4400);

    setTimeout(() => {
      addLog('info', 'Executing migration transactions...');
    }, 5000);

    setTimeout(() => {
      addLog('success', 'Migration applied successfully!');
      addLog('info', 'Database schema is now up to date.');
      addLog('info', 'Affected records: 3,456 rows updated');
      addLog('info', 'Migration duration: 4.2 seconds');
      setIsMigrating(false);
    }, 6000);
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

  const getLogStyles = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Database className="size-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Prisma Migration</h1>
            <p className="text-gray-600">Pull database schema and run migrations with Prisma ORM</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Server Selection & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Source Server */}
            <Card>
              <CardHeader>
                <CardTitle>Source Server</CardTitle>
                <CardDescription>Select the database to pull schema from</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={sourceServer} onValueChange={setSourceServer}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select source server..." />
                  </SelectTrigger>
                  <SelectContent>
                    {servers.map((server) => (
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

            {/* Target Server */}
            <Card>
              <CardHeader>
                <CardTitle>Target Server</CardTitle>
                <CardDescription>Select the database to migrate to</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={targetServer} onValueChange={setTargetServer}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select target server..." />
                  </SelectTrigger>
                  <SelectContent>
                    {servers.map((server) => (
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

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
                <CardDescription>Execute migration operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handlePullDB}
                  disabled={!sourceServer || isPulling}
                  variant={schemaStatus === 'pulled' ? 'outline' : 'default'}
                >
                  {isPulling ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Pulling Schema...
                    </>
                  ) : (
                    <>
                      <Download className="size-4 mr-2" />
                      Pull DB Schema
                    </>
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  <Separator className="flex-1" />
                  <ArrowRight className="size-4 text-gray-400" />
                  <Separator className="flex-1" />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleMigrate}
                  disabled={!targetServer || schemaStatus !== 'pulled' || isMigrating}
                >
                  {isMigrating ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Migrating...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="size-4 mr-2" />
                      Run Migration
                    </>
                  )}
                </Button>

                {schemaStatus === 'pulled' && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <span className="text-sm text-green-700">Schema ready for migration</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Migration Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Schema Status:</span>
                  <Badge variant={schemaStatus === 'pulled' ? 'default' : 'secondary'}>
                    {schemaStatus === 'pulled' ? 'Pulled' : 'Not Pulled'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Source Selected:</span>
                  <Badge variant={sourceServer ? 'default' : 'secondary'}>
                    {sourceServer ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Target Selected:</span>
                  <Badge variant={targetServer ? 'default' : 'secondary'}>
                    {targetServer ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Migration Log */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Migration Log</CardTitle>
              <CardDescription>Real-time execution logs and status updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[700px] pr-4">
                {logs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <div className="size-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Database className="size-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No migration logs yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Select servers and start pulling or migrating to see logs
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className={`flex gap-3 p-3 rounded-lg border ${getLogStyles(log.type)}`}
                      >
                        <div className="flex-shrink-0 mt-0.5">{getLogIcon(log.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-gray-500">
                              {log.timestamp}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-xs px-1.5 py-0"
                            >
                              {log.type.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-800 font-mono break-words">
                            {log.message}
                          </p>
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