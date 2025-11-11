import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type UserRole = 'specialist' | 'mol' | 'head' | null;
type RequestStatus = 'draft' | 'mol_review' | 'head_review' | 'approved' | 'rejected' | 'completed';
type Priority = 'normal' | 'urgent';

interface Request {
  id: string;
  specialist: string;
  room: string;
  printer: string;
  priority: Priority;
  status: RequestStatus;
  createdAt: string;
  molDecision?: 'available' | 'unavailable';
  headDecision?: 'approved' | 'rejected';
  rejectionReason?: string;
}

const USERS = {
  'turkina': { name: 'Туркина Дарья Павловна', roles: ['mol', 'specialist'], email: 'turkina@tomsk-7.ru' },
  'kovalev': { name: 'Ковалев Егор Владимирович', roles: ['head', 'specialist'], email: 'kovale@tomsl.ru' },
  'konovalova': { name: 'Коновалова Ольга Владимировна', roles: ['specialist'], email: 'konovalova@tomsk-7.ru' },
  'smirnova': { name: 'Смирнова Елена Александровна', roles: ['specialist'], email: 'smirnova@tomsk-7.ru' },
  'evdokimova': { name: 'Евдокимова Юлия Юрьевна', roles: ['specialist'], email: 'evdokimova@tomsk-7.ru' },
  'metelkova': { name: 'Метелькова Екатерина Александровна', roles: ['specialist'], email: 'metelkova@tomsk-7.ru' },
  'mayorova': { name: 'Майорова Ирина Ивановна', roles: ['specialist'], email: 'mayorova@tomsk-7.ru' },
  'kovaleva': { name: 'Ковалева Лариса Юрьевна', roles: ['specialist'], email: 'kovaleva@tomsk-7.ru' },
  'makarova': { name: 'Макарова Наталья Валерьевна', roles: ['specialist'], email: 'makarova@tomsk-7.ru' },
  'nemec': { name: 'Немец Ольга Борисовна', roles: ['specialist'], email: 'nemec@tomsk-7.ru' },
  'simon': { name: 'Симон Ирина Сергеевна', roles: ['specialist'], email: 'simon@tomsk-7.ru' },
  'sotskova': { name: 'Сотскова Юлия Петровна', roles: ['specialist'], email: 'sotskova@tomsk-7.ru' },
  'galeva': { name: 'Галева Оксана Дмитриевна', roles: ['specialist'], email: 'galeva@tomsk-7.ru' },
  'pankina': { name: 'Панкина Ольга Викторовна', roles: ['specialist'], email: 'pankina@tomsk-7.ru' },
  'borohova': { name: 'Борохова Надежда Ивановна', roles: ['specialist'], email: 'borohova@tomsk-7.ru' },
  'gavrilova': { name: 'Гаврилова Ольга Андреевна', roles: ['specialist'], email: 'gavrilova@tomsk-7.ru' },
  'krivolutskaya': { name: 'Криволуцкая Оксана Владимировна', roles: ['specialist'], email: 'krivolutskaya@tomsk-7.ru' },
  'nesupravina': { name: 'Несуправина Светлана Николаевна', roles: ['specialist'], email: 'nesupravina@tomsk-7.ru' },
  'radyuk': { name: 'Радюк Екатерина Владимировна', roles: ['specialist'], email: 'radyuk@tomsk-7.ru' },
  'teterina': { name: 'Тетерина Елена Робертовна', roles: ['specialist'], email: 'teterina@tomsk-7.ru' },
  'fedorova': { name: 'Федорова Ольга Андреевна', roles: ['specialist'], email: 'fedorova@tomsk-7.ru' },
  'tupikin': { name: 'Тупикин Андрей Александрович', roles: ['specialist'], email: 'tupikin@tomsk-7.ru' },
  'ilichev': { name: 'Ильичев Матвей Александрович', roles: ['specialist'], email: 'ilichev@tomsk-7.ru' },
  'ovechkina': { name: 'Овечкина Ирина Игоревна', roles: ['specialist'], email: 'ovechkina@tomsk-7.ru' },
  'kraeva': { name: 'Краева Ольга Александровна', roles: ['specialist'], email: 'kraeva@tomsk-7.ru' },
  'malysheva': { name: 'Малышева Светлана Альбертовна', roles: ['specialist'], email: 'malysheva@tomsk-7.ru' },
  'sverdlova': { name: 'Свердлова Галина Николаевна', roles: ['specialist'], email: 'sverdlova@tomsk-7.ru' },
  'grigoryeva': { name: 'Григорьева Елизавета Андреевна', roles: ['specialist'], email: 'grigoryeva@tomsk-7.ru' },
  'kovalenko': { name: 'Коваленко Галина Сергеевна', roles: ['specialist'], email: 'kovalenko@tomsk-7.ru' },
  'subbota': { name: 'Суббота Мария Владимировна', roles: ['specialist'], email: 'subbota@tomsk-7.ru' },
  'fomina': { name: 'Фомина Ольга Александровна', roles: ['specialist'], email: 'fomina@tomsk-7.ru' },
  'luboshnikova': { name: 'Лубошникова Екатерина Николаевна', roles: ['specialist'], email: 'luboshnikova@tomsk-7.ru' },
  'zhidkih': { name: 'Жидких Марина Алексеевна', roles: ['specialist'], email: 'zhidkih@tomsk-7.ru' },
  'ivanova': { name: 'Иванова Зоя Михайловна', roles: ['specialist'], email: 'ivanova@tomsk-7.ru' },
  'noskova': { name: 'Носкова Ольга Николаевна', roles: ['specialist'], email: 'noskova@tomsk-7.ru' },
  'tronina': { name: 'Тронина Оксана Игоревна', roles: ['specialist'], email: 'tronina@tomsk-7.ru' },
  'bobrov': { name: 'Бобров Вячеслав Викторович', roles: ['specialist'], email: 'bobrov@tomsk-7.ru' },
  'chistyakov': { name: 'Чистяков Юрий Александрович', roles: ['specialist'], email: 'chistyakov@tomsk-7.ru' }
};

const ROOMS = ['111', '301', '302', '303'];
const PRINTERS = ['111444-МФУ 225', '1115336-МФУ 236'];

const getStatusText = (status: RequestStatus) => {
  const statusMap = {
    'draft': 'Черновик',
    'mol_review': 'На проверке МОЛ',
    'head_review': 'На утверждении',
    'approved': 'Утверждено',
    'rejected': 'Отклонено',
    'completed': 'Выполнено'
  };
  return statusMap[status];
};

const getStatusColor = (status: RequestStatus) => {
  const colorMap = {
    'draft': 'bg-gray-100 text-gray-800',
    'mol_review': 'bg-blue-100 text-blue-800',
    'head_review': 'bg-amber-100 text-amber-800',
    'approved': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
    'completed': 'bg-emerald-100 text-emerald-800'
  };
  return colorMap[status];
};

export default function Index() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>(null);
  const [requests, setRequests] = useState<Request[]>([
    {
      id: '001',
      specialist: 'Иванов Иван Иванович',
      room: '301',
      printer: '111444-МФУ 225',
      priority: 'urgent',
      status: 'mol_review',
      createdAt: new Date().toISOString()
    },
    {
      id: '002',
      specialist: 'Туркина Дарья Павловна',
      room: '111',
      printer: '1115336-МФУ 236',
      priority: 'normal',
      status: 'head_review',
      createdAt: new Date().toISOString(),
      molDecision: 'available'
    }
  ]);

  const [newRequest, setNewRequest] = useState({
    room: '',
    printer: '',
    priority: 'normal' as Priority
  });

  const handleLogin = (userId: string, role: UserRole) => {
    setCurrentUser(userId);
    setCurrentRole(role);
    toast.success(`Вход выполнен как ${USERS[userId as keyof typeof USERS].name} (${role === 'mol' ? 'МОЛ' : role === 'head' ? 'Начальник' : 'Специалист'})`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    toast.info('Выход выполнен');
  };

  const createRequest = () => {
    if (!newRequest.room || !newRequest.printer) {
      toast.error('Заполните все поля');
      return;
    }

    const request: Request = {
      id: String(requests.length + 1).padStart(3, '0'),
      specialist: currentUser ? USERS[currentUser as keyof typeof USERS].name : 'Неизвестный',
      room: newRequest.room,
      printer: newRequest.printer,
      priority: newRequest.priority,
      status: 'mol_review',
      createdAt: new Date().toISOString()
    };

    setRequests([...requests, request]);
    setNewRequest({ room: '', printer: '', priority: 'normal' });
    toast.success('Заявка создана и отправлена МОЛу');
  };

  const handleMolDecision = (requestId: string, decision: 'available' | 'unavailable') => {
    setRequests(requests.map(req => {
      if (req.id === requestId) {
        if (decision === 'available') {
          return { ...req, molDecision: decision, status: 'head_review' as RequestStatus };
        } else {
          return { ...req, molDecision: decision, status: 'rejected' as RequestStatus, rejectionReason: 'Картридж отсутствует' };
        }
      }
      return req;
    }));
    toast.success(decision === 'available' ? 'Заявка отправлена начальнику' : 'Заявка отклонена');
  };

  const handleHeadDecision = (requestId: string, decision: 'approved' | 'rejected') => {
    setRequests(requests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          headDecision: decision,
          status: decision === 'approved' ? 'approved' : 'rejected',
          rejectionReason: decision === 'rejected' ? 'Не утверждено начальником' : undefined
        };
      }
      return req;
    }));
    toast.success(decision === 'approved' ? 'Заявка утверждена и отправлена администратору' : 'Заявка возвращена заявителю');
  };

  if (!currentUser || !currentRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Building2" size={32} className="text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Система заявок</CardTitle>
            <CardDescription>Управление заявками на замену картриджей</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(USERS).map(([userId, user]) => (
              <div key={userId} className="space-y-2">
                <div className="font-medium text-sm text-muted-foreground">{user.name}</div>
                <div className="flex gap-2">
                  {user.roles.map((role) => (
                    <Button
                      key={role}
                      onClick={() => handleLogin(userId, role as UserRole)}
                      className="flex-1"
                      variant={role === 'mol' || role === 'head' ? 'default' : 'outline'}
                    >
                      <Icon 
                        name={role === 'mol' ? 'ClipboardCheck' : role === 'head' ? 'Crown' : 'User'} 
                        size={16} 
                        className="mr-2" 
                      />
                      {role === 'mol' ? 'МОЛ' : role === 'head' ? 'Начальник' : 'Специалист'}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  const myRequests = requests.filter(req => 
    req.specialist === USERS[currentUser as keyof typeof USERS].name
  );
  
  const molRequests = requests.filter(req => req.status === 'mol_review');
  const headRequests = requests.filter(req => req.status === 'head_review');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Система заявок</h1>
              <p className="text-sm text-muted-foreground">Управление картриджами</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-medium">{USERS[currentUser as keyof typeof USERS].name}</div>
              <div className="text-sm text-muted-foreground">
                {currentRole === 'mol' ? 'МОЛ' : currentRole === 'head' ? 'Начальник Управления' : 'Специалист'}
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Выход
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue={currentRole === 'specialist' ? 'new' : 'approval'} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl mx-auto" style={{ gridTemplateColumns: `repeat(${currentRole === 'specialist' ? 2 : 3}, 1fr)` }}>
            {currentRole === 'specialist' && (
              <TabsTrigger value="new" className="gap-2">
                <Icon name="FilePlus" size={16} />
                Новая заявка
              </TabsTrigger>
            )}
            {(currentRole === 'mol' || currentRole === 'head') && (
              <TabsTrigger value="approval" className="gap-2">
                <Icon name="ClipboardCheck" size={16} />
                Согласование
              </TabsTrigger>
            )}
            <TabsTrigger value="my" className="gap-2">
              <Icon name="FileText" size={16} />
              Мои заявки
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <Icon name="Archive" size={16} />
              История
            </TabsTrigger>
          </TabsList>

          {currentRole === 'specialist' && (
            <TabsContent value="new">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="FilePlus" size={24} />
                    Создать заявку
                  </CardTitle>
                  <CardDescription>
                    Заполните форму для подачи заявки на замену картриджа
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="room">Номер кабинета</Label>
                    <Select value={newRequest.room} onValueChange={(value) => setNewRequest({...newRequest, room: value})}>
                      <SelectTrigger id="room">
                        <SelectValue placeholder="Выберите кабинет" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROOMS.map(room => (
                          <SelectItem key={room} value={room}>
                            Кабинет {room}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printer">Инвентарный номер принтера</Label>
                    <Select value={newRequest.printer} onValueChange={(value) => setNewRequest({...newRequest, printer: value})}>
                      <SelectTrigger id="printer">
                        <SelectValue placeholder="Выберите принтер" />
                      </SelectTrigger>
                      <SelectContent>
                        {PRINTERS.map(printer => (
                          <SelectItem key={printer} value={printer}>
                            {printer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Срочность</Label>
                    <Select value={newRequest.priority} onValueChange={(value) => setNewRequest({...newRequest, priority: value as Priority})}>
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Обычная</SelectItem>
                        <SelectItem value="urgent">Срочно</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={createRequest} className="w-full" size="lg">
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить заявку
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {(currentRole === 'mol' || currentRole === 'head') && (
            <TabsContent value="approval">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">
                    {currentRole === 'mol' ? 'Проверка наличия' : 'Утверждение заявок'}
                  </h2>
                  <Badge variant="secondary" className="text-base px-4 py-2">
                    {currentRole === 'mol' ? molRequests.length : headRequests.length} заявок
                  </Badge>
                </div>

                {(currentRole === 'mol' ? molRequests : headRequests).length === 0 ? (
                  <Alert>
                    <Icon name="CheckCircle2" size={18} />
                    <AlertDescription>
                      Нет заявок, ожидающих согласования
                    </AlertDescription>
                  </Alert>
                ) : (
                  (currentRole === 'mol' ? molRequests : headRequests).map(request => (
                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-3">
                              Заявка №{request.id}
                              {request.priority === 'urgent' && (
                                <Badge variant="destructive" className="gap-1">
                                  <Icon name="AlertCircle" size={14} />
                                  Срочно
                                </Badge>
                              )}
                            </CardTitle>
                            <CardDescription className="mt-2">
                              От: {request.specialist}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Кабинет</div>
                            <div className="font-medium">{request.room}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Принтер</div>
                            <div className="font-medium">{request.printer}</div>
                          </div>
                        </div>

                        {currentRole === 'mol' && (
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleMolDecision(request.id, 'available')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              size="lg"
                            >
                              <Icon name="CheckCircle" size={18} className="mr-2" />
                              В наличии
                            </Button>
                            <Button
                              onClick={() => handleMolDecision(request.id, 'unavailable')}
                              variant="destructive"
                              className="flex-1"
                              size="lg"
                            >
                              <Icon name="XCircle" size={18} className="mr-2" />
                              Отсутствует
                            </Button>
                          </div>
                        )}

                        {currentRole === 'head' && (
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleHeadDecision(request.id, 'approved')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                              size="lg"
                            >
                              <Icon name="ThumbsUp" size={18} className="mr-2" />
                              Утверждено
                            </Button>
                            <Button
                              onClick={() => handleHeadDecision(request.id, 'rejected')}
                              variant="destructive"
                              className="flex-1"
                              size="lg"
                            >
                              <Icon name="ThumbsDown" size={18} className="mr-2" />
                              Не утверждено
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          )}

          <TabsContent value="my">
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-2xl font-bold mb-6">Мои заявки</h2>
              {myRequests.length === 0 ? (
                <Alert>
                  <Icon name="FileText" size={18} />
                  <AlertDescription>
                    У вас пока нет заявок
                  </AlertDescription>
                </Alert>
              ) : (
                myRequests.map(request => (
                  <Card key={request.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="flex items-center gap-3">
                          Заявка №{request.id}
                          {request.priority === 'urgent' && (
                            <Badge variant="destructive" className="gap-1">
                              <Icon name="AlertCircle" size={14} />
                              Срочно
                            </Badge>
                          )}
                        </CardTitle>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Кабинет</div>
                          <div className="font-medium">{request.room}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Принтер</div>
                          <div className="font-medium">{request.printer}</div>
                        </div>
                      </div>
                      {request.rejectionReason && (
                        <Alert variant="destructive" className="mt-4">
                          <Icon name="AlertTriangle" size={18} />
                          <AlertDescription>
                            Причина отклонения: {request.rejectionReason}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-4xl mx-auto space-y-4">
              <h2 className="text-2xl font-bold mb-6">История заявок</h2>
              {requests.filter(r => ['approved', 'rejected', 'completed'].includes(r.status)).length === 0 ? (
                <Alert>
                  <Icon name="Archive" size={18} />
                  <AlertDescription>
                    История пуста
                  </AlertDescription>
                </Alert>
              ) : (
                requests
                  .filter(r => ['approved', 'rejected', 'completed'].includes(r.status))
                  .map(request => (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>Заявка №{request.id}</CardTitle>
                            <CardDescription>От: {request.specialist}</CardDescription>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusText(request.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Кабинет</div>
                            <div className="font-medium">{request.room}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Принтер</div>
                            <div className="font-medium">{request.printer}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}