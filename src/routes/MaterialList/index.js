import React from 'react';
import { ArrowForwardIos } from '@material-ui/icons';
import { ArrowDropDown, Delete } from '@mui/icons-material';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import ItemDescriptionInput from './Components/ItemDescriptionInput';
import ItemDetailsInputs from './Components/ItemDetailInput';
import MarginsInputs from './Components/MarginsInputs';
import { notify } from 'util/notify';
import {
    createMaterialItem,
    deleteMaterialItem,
    getAllMaterialList,
    updateMaterialItem
} from '../../Firebase/materialList/index';
import { onValue, ref, remove, set } from 'firebase/database';
import { formateData } from 'util/formateData';
import * as Config from '../../configs/index';

export default function MaterialList() {
    const [open, setOpen] = useState(true);
    const id = uuid().slice(0, 8);

    const [materialList, setMaterialList] = useState([]);
    const [isCreateNewItem, setIsCreateNewItem] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        getInitialDetails();
    }, []);

    const getInitialDetails = async () => {
        const materialRef = ref(Config.database, '/ADMIN/MATERIAL_LIST');

        await onValue(materialRef, (snapshot) => {
            const results = snapshot.val();
            const data = formateData(results);

            setMaterialList(data);
        });
    };

    const formik = useFormik({
        initialValues: {
            description: selectedItem?.description || '',
            category: selectedItem?.category || '',
            price: selectedItem?.price || '',
            um: selectedItem?.um || '',
            margins: {
                tier1: selectedItem?.margins?.tier1 || '',
                tier2: selectedItem?.margins?.tier2 || '',
                tier3: selectedItem?.margins?.tier3 || ''
            }
        },
        enableReinitialize: true,
        onSubmit: async (values) => {
            if (selectedId) {
                await updateMaterialItem(selectedId, {
                    description: values.description,
                    category: values.category,
                    price: values.price,
                    um: values.um,
                    margins: {
                        tier1: values.margins.tier1,
                        tier2: values.margins.tier2,
                        tier3: values.margins.tier3
                    }
                });
            } else {
                await createMaterialItem(id, {
                    id: id,
                    description: values.description,
                    category: values.category,
                    price: values.price,
                    um: values.um,
                    margins: {
                        tier1: values.margins.tier1,
                        tier2: values.margins.tier2,
                        tier3: values.margins.tier3
                    },
                    buy: {
                        price: '',
                        um: ''
                    },
                    sell: {
                        price: '',
                        um: ''
                    }
                });
            }

            formik.resetForm();
            setSelectedId(null);
            setSelectedItem(null);
            setIsCreateNewItem(false);
        }
    });

    const removeItem = async (id) => {
        await deleteMaterialItem(id);
        setIsCreateNewItem(false);
        setSelectedId(null);
        setSelectedItem(null);
    };

    const list =
        search != ''
            ? materialList?.filter((item) =>
                  item?.description?.toLowerCase().includes(search.toLowerCase())
              ) ?? []
            : materialList ?? [];

    if (filter) {
        if (filter === 'DESCRIPTION') {
            list.sort((a, b) => a?.description?.localeCompare(b?.description));
        }
        if (filter === 'CATEGORY') {
            list.sort((a, b) => a?.category?.localeCompare(b?.category));
        }
        if (filter === 'PRICE') {
            list.sort((a, b) => a?.price - b?.price);
        }
        if (filter === 'UM') {
            list.sort((a, b) => a?.um?.localeCompare(b?.um));
        }
        if (filter === 'MARGINS') {
            list.sort((a, b) => a?.margins?.tier1 - b?.margins?.tier1);
        }
    }

    const [category, setCategory] = useState('');
    const [categoryList, setCategoryList] = useState([]);

    useEffect(() => {
        getAllCategoryList();
    }, []);

    const getAllCategoryList = async () => {
        const materialRef = ref(Config.database, '/ADMIN/MATERIAL_CATEGORY_LIST');

        await onValue(materialRef, (snapshot) => {
            const results = snapshot.val();

            const data = formateData(results);

            setCategoryList(data);
        });
    };

    const handleAddCategory = async () => {
        if (category) {
            const id = uuid().slice(0, 8);

            const materialRef = ref(Config.database, `/ADMIN/MATERIAL_CATEGORY_LIST/${id}`);

            await set(materialRef, {
                id: id,
                category: category
            });
            setCategory('');
            notify('Category Added Successfully!', 1);
        }
    };

    const handleDeleteCategory = async (id) => {
        const materialRef = ref(Config.database, `/ADMIN/MATERIAL_CATEGORY_LIST/${id}`);

        await remove(materialRef);

        notify('Category Deleted Successfully!', 1);
    };

    return (
        <div className='flex flex-1 flex-col gap-10'>
            {/*  */}

            <div className='flex items-center gap-8'>
                <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder='Enter Category Name'
                    className='h-12 bg-white border rounded-lg outline-none px-4 font-bold  
                    placeholder:text-gray-300 text-black placeholder:font-bold'
                />
                <div
                    onClick={handleAddCategory}
                    className='font-bold text-lg text-blue-700 cursor-pointer'
                >
                    ADD
                </div>
            </div>
            <div className='flex flex-col gap-2 w-1/2'>
                {categoryList?.map((item) => {
                    return (
                        <div className='flex items-center gap-8 bg-slate-200 justify-between p-2 rounded-md'>
                            <div className='font-bold text-lg text-black cursor-pointer'>
                                {item.category}
                            </div>
                            <div
                                className='font-bold text-lg text-red-500 cursor-pointer'
                                onClick={() => handleDeleteCategory(item.id)}
                            >
                                <Delete />
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className='flex items-center gap-10 font-bold text-lg text-blue-700 '>
                <div
                    className='cursor-pointer'
                    onClick={() => {
                        setSelectedId(null);
                        setSelectedItem(null);
                        setIsCreateNewItem(true);
                    }}
                >
                    CREATE NEW ITEM
                </div>
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder='SEARCH'
                    className='h-12 bg-white border rounded-lg outline-none px-4 font-bold  
                    placeholder:text-gray-300 text-black placeholder:font-bold'
                />
                <div
                    className='cursor-pointer'
                    onClick={() => {
                        if (selectedId) {
                            formik.handleSubmit();
                        } else {
                            if (isCreateNewItem) {
                                if (
                                    formik.values.description &&
                                    formik.values.category &&
                                    formik.values.price &&
                                    formik.values.um
                                ) {
                                    formik.handleSubmit();
                                } else {
                                    notify('Please fill all the fields!', 0);
                                }
                            }
                        }
                    }}
                >
                    SAVE
                </div>
            </div>
            {/*  */}
            <div className='flex items-center gap-10 text-base font-bold'>
                <div
                    onClick={() => setFilter('DESCRIPTION')}
                    className='flex items-center gap-1 hover:text-red-500 cursor-pointer '
                >
                    <ArrowDropDown />
                    <h5 className='w-[300px]'>ITEM DESCRIPTION</h5>
                </div>
                <div className='flex items-center'>
                    <div
                        onClick={() => setFilter('CATEGORY')}
                        className='flex items-center gap-1 w-[200px] hover:text-red-500 cursor-pointer '
                    >
                        <ArrowDropDown />
                        <h5>CATEGORY</h5>
                    </div>
                    <div
                        onClick={() => setFilter('PRICE')}
                        className='flex items-center gap-1 w-[100px] hover:text-red-500 cursor-pointer '
                    >
                        <ArrowDropDown />
                        <h5>PRICE</h5>
                    </div>
                    <div
                        onClick={() => setFilter('UM')}
                        className='flex items-center gap-1 w-[100px] hover:text-red-500 cursor-pointer '
                    >
                        <ArrowDropDown />
                        <h5>UM</h5>
                    </div>
                    <div
                        onClick={() => setFilter('MARGINS')}
                        className='flex items-center gap-1 w-[200px] hover:text-red-500 cursor-pointer'
                    >
                        <ArrowDropDown />
                        <h5>MARGINS</h5>
                    </div>
                </div>
            </div>

            {isCreateNewItem && (
                <div className='flex flex-col gap-4'>
                    <div className='flex items-center gap-2 text-base font-bold'>
                        <ItemDescriptionInput
                            description={formik.values.description}
                            onChange={formik.handleChange('description')}
                            open={open}
                            onClick={() => setOpen(!open)}
                        />
                        <ItemDetailsInputs
                            CategoryList={categoryList.map((item) => {
                                return {
                                    value: item.category,
                                    label: item.category
                                };
                            })}
                            category={formik.values.category}
                            price={formik.values.price}
                            um={formik.values.um}
                            onCategoryChange={formik.handleChange('category')}
                            onPriceChange={(e) => {
                                formik.setFieldValue('price', e.target.value, false);
                            }}
                            onUmChange={(value) => {
                                formik.setFieldValue('um', value.target.value, false);
                            }}
                        />
                        <MarginsInputs
                            tier1={formik.values.margins.tier1}
                            tier2={formik.values.margins.tier2}
                            tier3={formik.values.margins.tier3}
                            onTier1Change={formik.handleChange('margins.tier1')}
                            onTier2Change={formik.handleChange('margins.tier2')}
                            onTier3Change={formik.handleChange('margins.tier3')}
                            onDelete={() => setIsCreateNewItem(false)}
                        />
                    </div>
                </div>
            )}
            <div className={`flex flex-col gap-1 relative`}>
                {selectedId == null && (
                    <div className='flex font-bold text-lg items-center absolute right-7 -top-7'>
                        <h5 className='w-[100px]'>Tier1</h5>
                        <h5 className='w-[100px]'>Tier2</h5>
                        <h5 className='w-[100px]'>Tier3</h5>
                    </div>
                )}
                {list?.map((item) => {
                    const isSelected = item.id === selectedId;

                    return (
                        <>
                            <div className='flex items-center gap-20 text-base font-bold'>
                                <div className='flex items-center gap-2 w-[300px]'>
                                    <div
                                        onClick={() => {
                                            if (item.id === selectedId) {
                                                setSelectedId(null);
                                            } else {
                                                setSelectedId(item.id);
                                                setSelectedItem(item);
                                            }
                                        }}
                                        className='cursor-pointer'
                                    >
                                        <ArrowForwardIos
                                            className={
                                                item.id === selectedId ? 'rotate-90' : 'rotate-0'
                                            }
                                        />
                                    </div>
                                    <div className='font-bold text-lg line-clamp-1'>
                                        {item?.description.toUpperCase()}
                                    </div>
                                </div>
                                {!isSelected && (
                                    <div className='flex items-center '>
                                        <div className='font-bold text-lg w-[200px] '>
                                            {item?.category.toUpperCase()}
                                        </div>
                                        <div className='font-bold text-lg w-[100px]'>
                                            {`$ ${item?.price}`}
                                        </div>
                                        <div className='font-bold text-lg w-[90px]'>
                                            {item?.um.toUpperCase()}
                                        </div>
                                        <div className='flex font-bold text-sm  items-center w-[300px]'>
                                            <h5 className='w-[100px]'>
                                                $
                                                {item?.margins?.tier1 != ''
                                                    ? item?.margins?.tier1
                                                    : '0'}
                                            </h5>
                                            <h5 className='w-[100px]'>
                                                $
                                                {item?.margins?.tier2 != ''
                                                    ? item?.margins?.tier2
                                                    : '0'}
                                            </h5>
                                            <h5 className='w-[100px]'>
                                                $
                                                {item?.margins?.tier3 != ''
                                                    ? item?.margins?.tier3
                                                    : '0'}
                                            </h5>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {item.id === selectedId && (
                                <div className='flex flex-col gap-4 m-4'>
                                    <div className='flex items-center gap-2 text-base font-bold'>
                                        <ItemDescriptionInput
                                            description={formik.values.description}
                                            onChange={formik.handleChange('description')}
                                            open={open}
                                        />
                                        <ItemDetailsInputs
                                            CategoryList={categoryList.map((item) => {
                                                return {
                                                    value: item.category,
                                                    label: item.category
                                                };
                                            })}
                                            category={formik.values.category}
                                            price={formik.values.price}
                                            um={formik.values.um}
                                            onCategoryChange={formik.handleChange('category')}
                                            onPriceChange={(e) => {
                                                const value = e.target.value.toString();
                                                formik.setFieldValue('price', value, false);
                                            }}
                                            onUmChange={formik.handleChange('um')}
                                        />
                                        <MarginsInputs
                                            tier1={formik.values.margins.tier1}
                                            tier2={formik.values.margins?.tier2}
                                            tier3={formik.values.margins?.tier3}
                                            onTier1Change={formik.handleChange('margins.tier1')}
                                            onTier2Change={formik.handleChange('margins.tier2')}
                                            onTier3Change={formik.handleChange('margins.tier3')}
                                            onDelete={() => removeItem(item.id)}
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    );
                })}
            </div>
        </div>
    );
}
