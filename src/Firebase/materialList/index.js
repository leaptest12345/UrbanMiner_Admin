import { ref, remove, set, update, onValue } from 'firebase/database';

import * as Config from '../../configs/index';

import { notify } from 'util/notify';
import { formateData } from 'util/formateData';

export const createMaterialItem = async (id, data) => {
    const materialRef = ref(Config.database, `/ADMIN/MATERIAL_LIST/${id}`);

    await set(materialRef, data);
    notify('Material Item Successfully Added!', 1);
};

export const updateMaterialItem = async (id, data) => {
    const materialRef = ref(Config.database, `/ADMIN/MATERIAL_LIST/${id}`);

    await update(materialRef, data);
    notify('Material Item Successfully updated!', 1);
};

export const deleteMaterialItem = async (id) => {
    const materialRef = ref(Config.database, `/ADMIN/MATERIAL_LIST/${id}`);

    await remove(materialRef);

    notify('Material Item Successfully Removed!', 1);
};

export const getAllMaterialList = async () => {
    const materialRef = ref(Config.database, '/ADMIN/MATERIAL_LIST');
    let data = null;

    await onValue(materialRef, (snapshot) => {
        const results = snapshot.val();
        data = formateData(results);
    });

    return data;
};
