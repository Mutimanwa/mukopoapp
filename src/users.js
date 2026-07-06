const users = [
    {
        name: 'Admin Mukopo',
        email: 'admin@mukopo.com',
        password: 'password123',
        role: 'Admin',
        team: 'Direction'
    },
    {
        name: 'Alain Manager',
        email: 'manager@mukopo.com',
        password: 'password123',
        role: 'Manager',
        team: 'Direction Technique'
    },
    {
        name: 'Carine Finance',
        email: 'finance@mukopo.com',
        password: 'password123',
        role: 'Finance',
        team: 'Comptabilité & Finances'
    },
    {
        name: 'David Employe',
        email: 'employe@mukopo.com',
        password: 'password123',
        role: 'Employe',
        team: 'Marketing & Événementiel',
        managerId: null // Vous pourrez lier un manager ici plus tard
    },
];

export default users;