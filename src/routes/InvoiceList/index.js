import React from 'react';
import { useEffect } from 'react';

import moment from 'moment';
import { useHistory } from 'react-router-dom';

import { deleteItem, getList } from '../../Firebase/contact/index';
import { CustomizedTable } from './utils';
import { getPdf } from '../../Firebase/pdf/index';
import { convertSlugToUrl } from 'resources/utilities';
import slugs from 'resources/slugs';

export default function InvoiceList(props) {
    const { userId, type } = props.location.state;
    const { push } = useHistory();
    const [list, setList] = React.useState([]);

    useEffect(() => {
        getItemList();
    }, [userId, type]);

    const getItemList = async () => {
        const response = await getList(userId, type);
        setList(response);
    };

    return (
        <div>
            <div className='flex flex-col gap-4'>
                <div className='text-2xl font-bold'>{type} LIST</div>
                <div>
                    {type == 'CONTACT' ? (
                        <CustomizedTable
                            type={type}
                            headerLabelList={['ContactType', 'EntityType', 'Name', 'Address']}
                            bodyItemList={list.map((item, index) => {
                                return {
                                    list: [
                                        item.contactType,
                                        item.entityType,
                                        item.contactType == 'Business'
                                            ? item?.businessInfo?.businessName
                                            : item?.individualInfo?.name,
                                        item.contactType == 'Business'
                                            ? item?.businessInfo?.businessAddress?.streetAddress
                                            : item?.individualInfo?.address?.streetAddress
                                    ],
                                    itemDetail: item
                                };
                            })}
                            onClick={(item) => {
                                push({
                                    pathname: convertSlugToUrl(slugs.ContactDetail, {}),
                                    state: {
                                        userId: userId,
                                        itemId: item.id,
                                        type: item.contactType
                                    }
                                });
                            }}
                            onDelete={async (id) => {
                                await deleteItem(userId, type, id);
                                getItemList();
                            }}
                        />
                    ) : type == 'BUY' || type == 'SELL' || type == 'PACKING' ? (
                        <CustomizedTable
                            type={type}
                            headerLabelList={[
                                'InvoiceNo',
                                'SupplierName',
                                'Status',
                                'Quantity',
                                'Price',
                                'CreatedDate'
                            ]}
                            bodyItemList={list.map((item, index) => {
                                return {
                                    list: [
                                        item.invoiceNo,
                                        item.supplierName,
                                        item.status,
                                        item.totalItems,
                                        `$${item.totalAmount}`,
                                        moment(item.createdDate).format('DD-MM-YYYY')
                                    ],
                                    itemDetail: item
                                };
                            })}
                            onClick={async (item) => {
                                const pdf = await getPdf(userId, item.supplierId, item.id);
                                window.open(pdf?.invoicePdf);
                            }}
                            onDelete={async (id) => {
                                await deleteItem(userId, type, id);
                                getItemList();
                            }}
                        />
                    ) : type == 'INVENTORY' ? (
                        <CustomizedTable
                            type={type}
                            headerLabelList={[
                                'ProductName',
                                'GrossWeight',
                                'TareWeight',
                                'NetWeight',
                                'updatedDate'
                            ]}
                            bodyItemList={list.map((item, index) => {
                                return {
                                    list: [
                                        item.productName,
                                        item.grossWeight,
                                        item.tareWeight,
                                        item.netWeight,
                                        moment(item.updatedAt).format('DD-MM-YYYY')
                                    ],
                                    itemDetail: item
                                };
                            })}
                            onClick={async (item) => {
                                const pdf = await getPdf(userId, item.supplierId, item.id);
                                window.open(pdf?.invoicePdf);
                            }}
                            onDelete={async (id) => {
                                await deleteItem(userId, type, id);
                                getItemList();
                            }}
                        />
                    ) : (
                        <CustomizedTable
                            type={type}
                            headerLabelList={[
                                'ContactNo',
                                'CustomerName',
                                'Status',
                                'IssueDate',
                                'ExpiryDate',
                                'Created Date'
                            ]}
                            bodyItemList={list.map((item, index) => {
                                return {
                                    list: [
                                        item.contractNo,
                                        item.customerName,
                                        item.status,
                                        moment(item.issueDate).format('DD-MM-YYYY'),
                                        moment(item.expiryDate).format('DD-MM-YYYY'),
                                        moment(item.updatedAt).format('DD-MM-YYYY')
                                    ],
                                    itemDetail: item
                                };
                            })}
                            onClick={async (item) => {
                                const pdf = await getPdf(userId, item.customerId, item.id);
                                window.open(pdf?.invoicePdf);
                            }}
                            onDelete={async (id) => {
                                await deleteItem(userId, type, id);
                                getItemList();
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
