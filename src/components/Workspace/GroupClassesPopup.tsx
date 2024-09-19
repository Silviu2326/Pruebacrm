import React, { useState, useEffect } from 'react';
import { X, Edit2, Trash2, UserPlus, DollarSign } from 'lucide-react';
import { Button } from '../ComponentsReutilizables/Button.tsx';
import { Input } from '../ComponentsReutilizables/input.tsx';
import { Label } from '../ComponentsReutilizables/label.tsx';
import { Textarea } from '../ComponentsReutilizables/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ComponentsReutilizables/select.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ComponentsReutilizables/dialog.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ComponentsReutilizables/tabs.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ComponentsReutilizables/table.tsx';
import { Checkbox } from '../ComponentsReutilizables/checkbox.tsx';

type Participant = { _id: string; nombre: string; apellido: string; email: string; telefono: string }
type AttendanceParticipant = Participant & { attended: boolean }
type Session = { id: string; date: string; time: string; location: string; attendance?: string[] }
type Payment = { id: string; amount: number; date: string; status: string }
type Service = {
  name: string
  maxParticipants: number
  paymentType: 'fijo' | 'por_sesion' | 'paquete_sesiones'
  frequency: string
  price: number
  durationMonths: number
  sessionPackage?: number
  cliente?: Participant
  sessions?: Session[]
  paymentInfo?: Payment[]
}

interface GroupClassesPopupProps {
  service: Service
  onClose: () => void
}

export default function GroupClassesPopup({ service, onClose }: GroupClassesPopupProps) {
  const [classDetails, setClassDetails] = useState({
    name: '',
    maxParticipants: 0,
    paymentType: 'fijo',
    frequency: '',
    price: 0,
    durationMonths: 0,
    sessionPackage: 1,
  });

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [clients, setClients] = useState<Participant[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [newSession, setNewSession] = useState({ date: '', time: '', location: '' });
  const [attendanceSessionId, setAttendanceSessionId] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<AttendanceParticipant[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<Payment[]>([]);

  useEffect(() => {
    if (service) {
      setClassDetails({
        name: service.name,
        maxParticipants: service.maxParticipants,
        paymentType: service.paymentType,
        frequency: service.frequency,
        price: service.price,
        durationMonths: service.durationMonths,
        sessionPackage: service.sessionPackage || 1,
      });
      setParticipants(service.cliente ? [service.cliente] : []);
      setSessions(service.sessions || []);
      setPaymentInfo(service.paymentInfo || []);
    }
  }, [service]);

  useEffect(() => {
    fetch('http://localhost:5005/api/clientes')
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(error => console.error('Error fetching clients:', error));
  }, []);

  const handleAddParticipant = () => {
    if (selectedClient) {
      const client = clients.find(client => client._id === selectedClient);
      if (client) {
        setParticipants([...participants, client]);
        setSelectedClient('');
      }
    }
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(participant => participant._id !== id));
  };

  const handleAddSession = () => {
    if (newSession.date && newSession.time && newSession.location) {
      setSessions([...sessions, { ...newSession, id: Date.now().toString() }]);
      setNewSession({ date: '', time: '', location: '' });
    }
  };

  const handleRemoveSession = (id: string) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const handleAttendanceClick = (sessionId: string) => {
    setAttendanceSessionId(sessionId);
    setAttendance(participants.map(p => ({ ...p, attended: false })));
  };

  const handleAttendanceChange = (participantId: string) => {
    setAttendance(attendance.map(p =>
      p._id === participantId ? { ...p, attended: !p.attended } : p
    ));
  };

  const handleSaveAttendance = () => {
    if (attendanceSessionId) {
      const updatedSessions = sessions.map(session => {
        if (session.id === attendanceSessionId) {
          return { ...session, attendance: attendance.filter(p => p.attended).map(p => p._id) };
        }
        return session;
      });
      setSessions(updatedSessions);
      setAttendanceSessionId(null);
    }
  };

  const calculatePaymentForecast = () => {
    const totalParticipants = participants.length;
    let totalRevenue = 0;

    if (classDetails.paymentType === 'fijo') {
      totalRevenue = totalParticipants * classDetails.price;
    } else if (classDetails.paymentType === 'por_sesion') {
      totalRevenue = totalParticipants * classDetails.price * sessions.length;
    } else if (classDetails.paymentType === 'paquete_sesiones') {
      totalRevenue = totalParticipants * classDetails.price * classDetails.sessionPackage;
    }

    return {
      totalParticipants,
      totalRevenue,
      frequency: classDetails.frequency,
    };
  };

  const paymentForecast = calculatePaymentForecast();

  return (
    <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Detalles de la Clase Grupal</DialogTitle>
        <DialogDescription>
          Información detallada sobre la clase {service.name}
        </DialogDescription>
      </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="participants">Participantes</TabsTrigger>
            <TabsTrigger value="sessions">Sesiones</TabsTrigger>
            <TabsTrigger value="payments">Pagos</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <form className="space-y-4">
              <div>
                <Label htmlFor="class-name">Nombre de la Clase</Label>
                <Input
                  id="class-name"
                  value={classDetails.name}
                  onChange={(e) => setClassDetails({ ...classDetails, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="max-participants">Número Máximo de Participantes</Label>
                <Input
                  id="max-participants"
                  type="number"
                  value={classDetails.maxParticipants}
                  onChange={(e) => setClassDetails({ ...classDetails, maxParticipants: Number(e.target.value) })}
                />
              </div>
              <Button type="submit">Guardar Cambios</Button>
            </form>
          </TabsContent>
          <TabsContent value="participants">
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map(participant => (
                    <TableRow key={participant._id}>
                      <TableCell>{participant.nombre} {participant.apellido}</TableCell>
                      <TableCell>{participant.email}</TableCell>
                      <TableCell>{participant.telefono}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveParticipant(participant._id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar participante</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div>
                <Label htmlFor="add-participant">Agregar Participante</Label>
                <Select onValueChange={setSelectedClient}>
                  <SelectTrigger id="add-participant">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client._id} value={client._id}>
                        {client.nombre} {client.apellido}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleAddParticipant}>Añadir</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="sessions">
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Lugar</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map(session => (
                    <TableRow key={session.id}>
                      <TableCell>{session.date}</TableCell>
                      <TableCell>{session.time}</TableCell>
                      <TableCell>{session.location}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                            <span className="sr-only">Editar sesión</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveSession(session.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Eliminar sesión</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleAttendanceClick(session.id)}>
                            <UserPlus className="h-4 w-4" />
                            <span className="sr-only">Marcar asistencia</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={handleAddSession}>Agregar Nueva Sesión</Button>
            </div>
          </TabsContent>
          {attendanceSessionId && (
            <div className="space-y-4">
              <h4>Marcar Asistencia</h4>
              <ul>
                {attendance.map(participant => (
                  <li key={participant._id}>
                    <label className="flex items-center space-x-2">
                      <Checkbox
                        checked={participant.attended}
                        onCheckedChange={() => handleAttendanceChange(participant._id)}
                      />
                      <span>{participant.nombre} {participant.apellido}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <Button onClick={handleSaveAttendance}>Guardar Asistencia</Button>
            </div>
          )}
          <TabsContent value="payments">
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Monto</TableHead>
                    <TableHead>Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentInfo.map(payment => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>${payment.amount}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center">
                <span>Total Previsto: {paymentForecast.totalRevenue}€</span>
                <Button>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Registrar Pago
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
