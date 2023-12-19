import React from 'react';
import { ArrowForwardIos } from '@material-ui/icons';
import { ArrowDropDown } from '@mui/icons-material';
import { useState } from 'react';
import { onValue, ref, set, update } from 'firebase/database';
import { v4 as uuid } from 'uuid';
import { database } from 'configs/firebaseConfig';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { formateData } from 'util/formateData';
import ItemDescriptionInput from './Components/ItemDescriptionInput';
import ItemDetailsInputs from './Components/ItemDetailInput';
import MarginsInputs from './Components/MarginsInputs';
import { notify } from 'util/notify';

export default function MaterialList() {
    const [open, setOpen] = useState(true);
    const id = uuid().slice(0, 8);

    const [materialList, setMaterialList] = useState([]);
    const [isCreateNewItem, setIsCreateNewItem] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        getMaterialList();
    }, []);

    const getMaterialList = async () => {
        const starCount = ref(database, `/ADMIN/MATERIAL_LIST`);
        onValue(starCount, (data) => {
            setMaterialList(formateData(data.val()));
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
                const updateRef = ref(database, `/ADMIN/MATERIAL_LIST/${selectedId}`);

                await update(updateRef, {
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
                notify('Material Item Successfully updated!', 1);
            } else {
                const starCount = ref(database, `/ADMIN/MATERIAL_LIST/${id}`);

                await set(starCount, {
                    id: id,
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
                notify('Material Item Successfully Added!', 1);
            }

            formik.resetForm();
            setSelectedId(null);
            setSelectedItem(null);
            setIsCreateNewItem(false);
        }
    });

    const removeItem = (id) => {
        const starCount = ref(database, `/ADMIN/MATERIAL_LIST/${id}`);
        set(starCount, null);
        notify('Material Item Successfully Removed!', 1);
        setIsCreateNewItem(false);
        setSelectedId(null);
        setSelectedItem(null);
    };

    const list =
        search != ''
            ? materialList?.filter((item) =>
                  item?.description?.toLowerCase().includes(search.toLowerCase())
              )
            : materialList;

    return (
        <div className='flex flex-1 flex-col gap-10'>
            {/*  */}
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
                        }
                    }}
                >
                    EDIT
                </div>
                <div
                    onClick={() => {
                        if (isCreateNewItem) {
                            if (
                                formik.values.description &&
                                formik.values.category &&
                                formik.values.price &&
                                formik.values.um
                            ) {
                                formik.handleSubmit();
                            } else {
                                alert('Please fill all the fields!', 0);
                            }
                        }
                    }}
                    className='cursor-pointer'
                >
                    SAVE
                </div>
            </div>
            {/*  */}
            <div className='flex items-center gap-10 text-base font-bold'>
                <div className='flex items-center gap-1'>
                    <ArrowDropDown />
                    <h5 className='w-[400px]'>ITEM DESCRIPTION</h5>
                </div>
                <div className='flex items-center '>
                    <div className='flex items-center gap-1 w-[250px]'>
                        <ArrowDropDown />
                        <h5>CATEGORY</h5>
                    </div>
                    <div className='flex items-center gap-1 w-[250px]'>
                        <ArrowDropDown />
                        <h5>PRICE</h5>
                    </div>

                    <h5 className='w-[100px]'>UM</h5>
                </div>
            </div>
            {isCreateNewItem && (
                <div className='flex flex-col gap-4'>
                    <div className='flex items-center gap-20 text-base font-bold'>
                        <ItemDescriptionInput
                            description={formik.values.description}
                            onChange={formik.handleChange('description')}
                            open={open}
                            onClick={() => setOpen(!open)}
                        />
                        <ItemDetailsInputs
                            category={formik.values.category}
                            price={formik.values.price}
                            um={formik.values.um}
                            onCategoryChange={formik.handleChange('category')}
                            onPriceChange={formik.handleChange('price')}
                            onUmChange={formik.handleChange('um')}
                        />
                    </div>
                    {open && (
                        <MarginsInputs
                            tier1={formik.values.margins.tier1}
                            tier2={formik.values.margins.tier2}
                            tier3={formik.values.margins.tier3}
                            onTier1Change={formik.handleChange('margins.tier1')}
                            onTier2Change={formik.handleChange('margins.tier2')}
                            onTier3Change={formik.handleChange('margins.tier3')}
                            onDelete={() => setIsCreateNewItem(false)}
                        />
                    )}
                </div>
            )}
            <div className='flex flex-col gap-1'>
                {list?.map((item) => {
                    const isSelected = item.id === selectedId;

                    return (
                        <>
                            <div className='flex items-center gap-20 text-base font-bold'>
                                <div className='flex items-center gap-2 w-[400px]'>
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
                                    <div className='font-bold text-lg'>
                                        {item?.description.toUpperCase()}
                                    </div>
                                </div>
                                <div className='flex items-center gap-10'>
                                    <div className='font-bold text-lg w-[200px]'>
                                        {isSelected ? '' : item?.category.toUpperCase()}
                                    </div>
                                    <div className='font-bold text-lg w-[200px]'>
                                        {isSelected ? '' : `$ ${item?.price}`}
                                    </div>
                                    <div className='font-bold text-lg w-[100px]'>
                                        {isSelected ? '' : item?.um.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                            {item.id === selectedId && (
                                <div className='flex flex-col gap-4'>
                                    <div className='flex items-center gap-20 text-base font-bold'>
                                        <ItemDescriptionInput
                                            description={formik.values.description}
                                            onChange={formik.handleChange('description')}
                                            open={open}
                                        />
                                        <ItemDetailsInputs
                                            category={formik.values.category}
                                            price={formik.values.price}
                                            um={formik.values.um}
                                            onCategoryChange={formik.handleChange('category')}
                                            onPriceChange={formik.handleChange('price')}
                                            onUmChange={formik.handleChange('um')}
                                        />
                                    </div>
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
                            )}
                        </>
                    );
                })}
            </div>
        </div>
    );
}
