import moment from 'moment';

export const jobTitles = [
    { value: 'Ceo', label: 'CEO' },
    { value: 'Owner', label: 'Owner' },
    { value: 'Management', label: 'Management' },
    { value: 'Employee', label: 'Employee' },
    { value: 'Coo', label: 'COO' },
    { value: 'Cfo', label: 'CFO' }
];

export const customerTypes = [
    { value: 'RecyclingCenter', label: 'Recycling Center' },
    { value: 'AutoPartsYard', label: 'Auto Parts Yard' },
    { value: 'MufflerShop', label: 'Muffler Shop' },
    { value: 'MechanicShop', label: 'Mechanic Shop' },
    { value: 'CoreBuyer', label: 'Core Buyer' }
];

export const formateDate = (date) => {
    return new Date(date);
};
