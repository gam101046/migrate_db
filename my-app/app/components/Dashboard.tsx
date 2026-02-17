'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Server, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DatabaseServer {
  id: string;
  name: string;
  environment: 'development' | 'staging' | 'production';
  dbType: string;
  host: string;
  port: string;
  status: 'active' | 'inactive';
}

export function Dashboard() {
  const [servers, setServers] = useState<DatabaseServer[]>([
    {
      id: '1',
      name: 'Main Production DB',
      environment: 'production',
      dbType: 'PostgreSQL 15.2',
      host: 'prod-db-01.company.com',
      port: '5432',
      status: 'active',
    },
    {
      id: '2',
      name: 'Staging Database',
      environment: 'staging',
      dbType: 'PostgreSQL 15.2',
      host: 'staging-db-01.company.com',
      port: '5432',
      status: 'active',
    },
    {
      id: '3',
      name: 'Development MySQL',
      environment: 'development',
      dbType: 'MySQL 8.0',
      host: 'dev-mysql-01.company.com',
      port: '3306',
      status: 'active',
    },
    {
      id: '4',
      name: 'Legacy Database',
      environment: 'production',
      dbType: 'MySQL 5.7',
      host: 'legacy-db-01.company.com',
      port: '3306',
      status: 'inactive',
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<DatabaseServer | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    environment: 'development' as const,
    dbType: '',
    host: '',
    port: '',
  });

  const getEnvironmentBadge = (env: string) => {
    switch (env) {
      case 'production':
        return <Badge variant="destructive">Production</Badge>;
      case 'staging':
        return <Badge variant="outline">Staging</Badge>;
      case 'development':
        return <Badge variant="secondary">Development</Badge>;
      default:
        return <Badge>{env}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="default" className="bg-green-500">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    );
  };

  const handleAddServer = () => {
    const newServer: DatabaseServer = {
      id: Date.now().toString(),
      name: formData.name,
      environment: formData.environment,
      dbType: formData.dbType,
      host: formData.host,
      port: formData.port,
      status: 'active',
    };
    setServers([...servers, newServer]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditServer = () => {
    if (!selectedServer) return;
    setServers(
      servers.map((s) =>
        s.id === selectedServer.id
          ? {
              ...s,
              name: formData.name,
              environment: formData.environment,
              dbType: formData.dbType,
              host: formData.host,
              port: formData.port,
            }
          : s
      )
    );
    setIsEditDialogOpen(false);
    resetForm();
  };

  const handleDeleteServer = () => {
    if (!selectedServer) return;
    setServers(servers.filter((s) => s.id !== selectedServer.id));
    setIsDeleteDialogOpen(false);
    setSelectedServer(null);
  };

  const openEditDialog = (server: DatabaseServer) => {
    setSelectedServer(server);
    setFormData({
      name: server.name,
      environment: server.environment,
      dbType: server.dbType,
      host: server.host,
      port: server.port,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (server: DatabaseServer) => {
    setSelectedServer(server);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      environment: 'development',
      dbType: '',
      host: '',
      port: '',
    });
    setSelectedServer(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Server Management</h1>
          <p className="text-gray-600 mt-1">Manage your database servers and connections</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="size-4 mr-2" />
          Add Server
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Servers</CardDescription>
            <CardTitle className="text-3xl">{servers.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active</CardDescription>
            <CardTitle className="text-3xl text-green-600">
              {servers.filter((s) => s.status === 'active').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Production</CardDescription>
            <CardTitle className="text-3xl text-red-600">
              {servers.filter((s) => s.environment === 'production').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Development</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {servers.filter((s) => s.environment === 'development').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Servers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Database Servers</CardTitle>
          <CardDescription>View and manage all your database server connections</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Server Name</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>Database Type</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servers.map((server) => (
                <TableRow key={server.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Server className="size-4 text-gray-500" />
                      {server.name}
                    </div>
                  </TableCell>
                  <TableCell>{getEnvironmentBadge(server.environment)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Database className="size-4 text-gray-400" />
                      {server.dbType}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{server.host}</TableCell>
                  <TableCell className="text-sm text-gray-600">{server.port}</TableCell>
                  <TableCell>{getStatusBadge(server.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(server)}
                      >
                        <Pencil className="size-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(server)}
                      >
                        <Trash2 className="size-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Server Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Server</DialogTitle>
            <DialogDescription>
              Enter the details of the database server you want to add.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Server Name</Label>
              <Input
                id="name"
                placeholder="My Database Server"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="environment">Environment</Label>
              <Select
                value={formData.environment}
                onValueChange={(value: any) => setFormData({ ...formData, environment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dbType">Database Type</Label>
              <Input
                id="dbType"
                placeholder="PostgreSQL 15.2"
                value={formData.dbType}
                onChange={(e) => setFormData({ ...formData, dbType: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                placeholder="db.example.com"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                placeholder="5432"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddServer}>Add Server</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Server Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Server</DialogTitle>
            <DialogDescription>
              Update the details of your database server.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Server Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-environment">Environment</Label>
              <Select
                value={formData.environment}
                onValueChange={(value: any) => setFormData({ ...formData, environment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dbType">Database Type</Label>
              <Input
                id="edit-dbType"
                value={formData.dbType}
                onChange={(e) => setFormData({ ...formData, dbType: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-host">Host</Label>
              <Input
                id="edit-host"
                value={formData.host}
                onChange={(e) => setFormData({ ...formData, host: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-port">Port</Label>
              <Input
                id="edit-port"
                value={formData.port}
                onChange={(e) => setFormData({ ...formData, port: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditServer}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the server "{selectedServer?.name}". This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteServer}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}