export interface UsersData {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    role: string;
    token: string;
    message: string;
    logged: boolean;
}

export interface CustomersData {
    id: number;
    customer: string;
    address: string;
}

export interface SitesData {
    id: number;
    site: string;
    address: string;
}

export interface ContactsData {
    id: string;
    title: string;
    firstname: string;
    lastname: string;
    workphone: string;
    cellphone: string;
    email: string;
}

export interface SubsData {
    id: number;
    sub: string;
    address: string;
}

export interface SubsContactsData {
    id: string;
    title: string;
    firstname: string;
    lastname: string;
    workphone: string;
    cellphone: string;
    email: string;
}

export interface SuppliersData {
    id: number;
    sub: string;
    address: string;
}

export interface SuppliersContactsData {
    id: string;
    title: string;
    firstname: string;
    lastname: string;
    workphone: string;
    cellphone: string;
    email: string;
}

export interface BrandsData {
    id: number;
    brand: string;
    link: string;
}

export interface CategoriesData {
    id: number;
    category: string;
}

export interface TypesData {
    id: number;
    type: string;
    category: string;
}

export interface ProductsData {
    id: string;
    type: string;
    link: string;
    notes: string;
    brand: string;
    product: string;
    category: string;
    partnumber: string;
    description: string;
}

export interface Brands {
    id: number;
    brand: string;
}

export interface Categories {
    value: string;
    viewValue: string;
    category: string;
    id: number;
}

export interface Types {
    id: number;
    type: string;
    order_type_id: number;
}

export interface WarehousesData {
    id: string;
    name: string;
    address: string;
}

export interface Warehouses {
    id: string;
    name: string;
    address: string;
}
export interface Order_types {
    id: number;
    order_type: string;
}

export interface Order_statuses {
    id: number;
    status: string;
}

export interface WarehouseOrdersData {
    id: number;
    warehouse: string;
    order_type: string;
    order_status: number;
    create_date: string;
    create_by: string;
    modify_date: string;
    modify_by: string;
    notes: string;
}

export interface WarehouseOrdersDetailsData {
    id: number;
    warehouse: string;
    order_status: number;
    product: string;
    ordered_qty: number;
    received_qty: number,
    create_date: string;
    create_by: string;
    modify_date: string;
    modify_by: string;
    notes: string;
}

export interface StocksData {
    id: number;
    warehouse: string;
    brand: string;
    category: string;
    type: string;
    partnumber: string,
    ordered_qty: number;
    received_qty: number;
    return_qty: number;
    transfer_qty: number;
    received_from_transfer_qty: number;
    adjusted_qty: number;
    available: number;
}

export interface whSupplierStockData {
    id: number;
    warehouse: string;
    order_status: number;
    partnumber: string;
    ordered_qty: number;
    received_qty: number;
    supplier: string;
    ordernumber: string;
    create_date: string;
    create_by: string;
    modify_date: string;
    modify_by: string;
    notes: string;
}

export interface whSupplierReturnData {
    id: number;
    warehouse: string;
    order_status: number;
    partnumber: string;
    return_qty: number;
    supplier: string;
    ordernumber: string;
    create_date: string;
    create_by: string;
    modify_date: string;
    modify_by: string;
    notes: string;
}

export interface whAdjustmentData {
    id: number;
    warehouse: string;
    order_status: number;
    partnumber: string;
    old_qty: number;
    new_qty: number;
    create_date: string;
    create_by: string;
    modify_date: string;
    modify_by: string;
    notes: string;
}

export interface System_types {
    id: number;
    system_type: string;
}

export interface SysServersData {
    id: string;
    site_id: number;
    system_type: string;
    brand_id: number;
    server_type: string;
    name: string;
    product_id: string;
    serial_number: string;
    servise_tag: string;
    nic0_mac: string;
    nic0_ip: string;
    nic0_subnet: string;
    nic0_gateway: string;
    nic0_port: string;
    nic1_mac: string;
    nic1_ip: string;
    nic1_subnet: string;
    nic1_gateway: string;
    nic1_port: string;
    nic2_mac: string;
    nic2_ip: string;
    nic2_subnet: string;
    nic2_gateway: string;
    nic2_port: string;
    remote_ip: string;
    os_version: string;
    os_login: string;
    os_password: string;
    server_version: string;
    server_login: string;
    server_password: string;
    location: string;
    notes: string;
}

export interface SysDevicesData {
    id: string;
    site_id: number;
    system_type: string;
    brand_id: number;
    device_type: string;
    name: string;
    product_id: string;
    serial_number: string;
    nic_mac: string;
    nic_ip: string;
    nic_subnet: string;
    nic_gateway: string;
    nic_port: string;
    local_web_port: number;
    remote_ip: string;
    remote_web_port: number;
    username: string;
    password: string;
    firmware_version: string;
    link_name: string;
    link_password: string;
    location: string;
    notes: string;
}

export interface SysDoorsData {
    id: string;
    site_id: number;
    name: string;
    panel: string;
    label: string;
    notes: string;
}

export interface LicensesData {
    id: string;
    site_id: number;
    brand_id: number;
    system_type: string;
    type: string;
    license: string;
    devices_qty: number;
    activation_date: string;
    notes: string;
}

export interface RemoteAccessData {
    id: string;
    site_id: number;
    system_type: string;
    remote_type: string;
    remote_name: string;
    remote_id: string;
    remote_login: string;
    remote_password: string;
    notes: string;
}

export interface SiteNotesData {
    id: number;
    site: string;
    system_type: string;
    note: number;
    create_date: string;
    create_by: string;
    modify_date: string;
    modify_by: string;
    description: string;
}

export const navigationTabs:
    any[] = [
        { 'name': 'Summary' },
        { 'name': 'CCTV' },
        { 'name': 'ACCESS' },
        { 'name': 'INTRUSION' },
        { 'name': 'INTERCOM' },
        { 'name': 'NETWORK' },
        { 'name': 'OTHER' }
    ];
