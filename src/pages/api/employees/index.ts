import type { NextApiRequest, NextApiResponse } from 'next';
import { Employee } from '../../../types/employee';

// Temporary in-memory data store
let employees: Employee[] = [
  {
    id: 1,
    firstName: 'Marfin',
    lastName: 'Pro',
    position: 'Developer',
    phone: '1234567890',
    email: 'marfinpro@gmail.com',
  },
  {
    id: 2,
    firstName: 'Marfin',
    lastName: 'Design',
    position: 'Designer',
    phone: '0987654321',
    email: 'mdesign@gmail.com',
  },
];

// Handler function for the API route
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getEmployees(req, res);
    case 'POST':
      return addEmployee(req, res);
    case 'PUT':
      return updateEmployee(req, res);
    case 'DELETE':
      return deleteEmployee(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Get all employees
function getEmployees(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(employees);
}

// Add a new employee
function addEmployee(req: NextApiRequest, res: NextApiResponse) {
  const newEmployee: Employee = { id: Date.now(), ...req.body };
  employees.push(newEmployee);
  res.status(201).json(newEmployee);
}

// Update an existing employee
function updateEmployee(req: NextApiRequest, res: NextApiResponse) {
  const { id, firstName, lastName, position, phone, email } = req.body;
  const index = employees.findIndex((emp) => emp.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  // Update employee
  employees[index] = { id, firstName, lastName, position, phone, email };
  res.status(200).json(employees[index]);
}

// Delete an employee
function deleteEmployee(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: 'ID is required' });
  }

  const employeeId = Number(id);
  const index = employees.findIndex((emp) => emp.id === employeeId);

  if (index === -1) {
    return res.status(404).json({ message: 'Employee not found' });
  }

  // Delete employee
  employees = employees.filter((emp) => emp.id !== employeeId);
  res.status(204).end();
}
