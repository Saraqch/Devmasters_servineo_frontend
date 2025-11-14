export default function Users() {
  const users = [
    { id: 1, name: 'Ana García', email: 'ana@gmail.com', role: 'Admin' },
    { id: 2, name: 'Carlos López', email: 'carlos@gmail.com', role: 'User' },
    { id: 3, name: 'María Rodríguez', email: 'maria@gmail.com', role: 'Editor' },
    { id: 4, name: 'Pedro Martínez', email: 'pedro@gmail.com', role: 'User' },
    { id: 5, name: 'Laura Fernández', email: 'laura@gmail.com', role: 'Moderator' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lista de Usuarios</h1>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>
            <span
              className={`inline-block px-2 py-1 text-xs rounded-full ${
                user.role === 'Admin'
                  ? 'bg-red-100 text-red-800'
                  : user.role === 'Moderator'
                    ? 'bg-blue-100 text-blue-800'
                    : user.role === 'Editor'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
              }`}
            >
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
