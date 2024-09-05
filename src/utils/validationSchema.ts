import * as yup from 'yup';

// Define a validation schema using Yup for employee form validation
export const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot be longer than 50 characters'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot be longer than 50 characters'),
  
  position: yup
    .string()
    .required('Position is required')
    .min(2, 'Position must be at least 2 characters')
    .max(50, 'Position cannot be longer than 50 characters'),

  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d+$/, 'Phone number must only contain digits')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot be longer than 15 digits'),

  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email format'),
});
