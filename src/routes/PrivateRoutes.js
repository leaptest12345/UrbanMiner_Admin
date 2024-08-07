import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import SLUGS from 'resources/slugs';
import LoadingComponent from 'components/loading';
import PrivacyPolicy from './privacyPolicy/PrivacyPolicy';
import Items from './Items/items';
import PaymentList from './PaymentList/PaymentList';
import FeedBackList from './FeedbackList/FeedbackList';
import UserList from './UserList/UserList';
import TermAndConditions from './TermAndConditions/TermAndConditions';
import UserDetail from './UserDetail/UserDetail';
import AddProduct from './AddProduct/AddProduct';
import AdminList from './AdminList/adminList';
import AddAdmin from './AddAdmin/AddAdmin';
import PdfDetail from './PdfDetail/PdfDetail';
import PriceSheet from './PriceSheet/PriceSheet';
import CategoryImages from './CategoryImages/CategoryImages';
import EditCategory from './editCategory/editCategory';
import { UserPermission } from './UserPermission/UserPermission';
import Blog from './Blog/Blog';
import BlogDetails from './BlogDetails/BlogDetails';
import MaterialList from './MaterialList';
import { UnApprovedUserList } from './UnApprovedUserList';
import CategoryList from './categoryList';
import InvoiceList from './InvoiceList';
import { ContactDetail } from './contactDetail';
import { ViewDraft } from './ViewDraft';
import { ReferralCode } from './ReferralCode';

const DashboardComponent = lazy(() => import('./dashboard'));

function PrivateRoutes() {
    return (
        <Suspense fallback={<LoadingComponent loading />}>
            <Switch>
                <Route exact path={SLUGS.blog} component={Blog} render={() => <div>Blog</div>} />
                <Route
                    exact
                    path={SLUGS.blogDetails}
                    component={BlogDetails}
                    render={() => <div>BlogDetails</div>}
                />
                <Route
                    exact
                    path={SLUGS.UserDetail}
                    component={UserDetail}
                    render={() => <div>userDetail</div>}
                />
                <Route
                    exact
                    path={SLUGS.materialList}
                    component={MaterialList}
                    render={() => <div>MaterialList</div>}
                />
                <Route
                    exact
                    path={SLUGS.referralCode}
                    component={ReferralCode}
                    render={() => <div>ReferralCode</div>}
                />
                <Route
                    exact
                    path={SLUGS.invoiceList}
                    component={InvoiceList}
                    render={() => <div>Invoice List</div>}
                />
                <Route
                    exact
                    path={SLUGS.unApprovedList}
                    component={UnApprovedUserList}
                    render={() => <div>UnApproved UserList</div>}
                />
                <Route
                    exact
                    path={SLUGS.ViewDraft}
                    component={ViewDraft}
                    render={() => <div>DraftInvoice</div>}
                />

                <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
                <Route
                    exact
                    path={SLUGS.UserList}
                    component={UserList}
                    render={() => <div>UserList</div>}
                />
                <Route
                    exact
                    path={SLUGS.UserPermission}
                    component={UserPermission}
                    render={() => <div>User Permission</div>}
                />
                <Route
                    exact
                    path={SLUGS.categoryList}
                    component={CategoryList}
                    render={() => <div>Category List</div>}
                />
                <Route
                    exact
                    path={SLUGS.EditCategory}
                    component={EditCategory}
                    render={() => <div>Edit Category</div>}
                />
                <Route
                    exact
                    path={SLUGS.PriceSheet}
                    component={PriceSheet}
                    render={() => <div>PriceSheet</div>}
                />
                <Route exact path={SLUGS.items} component={Items} render={() => <div>items</div>} />
                <Route
                    exact
                    path={SLUGS.ContactDetail}
                    component={ContactDetail}
                    render={() => <div>ContactDetail</div>}
                />
                <Route
                    exact
                    path={SLUGS.PaymentList}
                    component={PaymentList}
                    render={() => <div>PaymentList</div>}
                />
                <Route
                    exact
                    path={SLUGS.TermAndCondition}
                    component={TermAndConditions}
                    render={() => <div>TermAndCondition</div>}
                />
                <Route
                    exact
                    path={SLUGS.AdminList}
                    component={AdminList}
                    render={() => <div>Admin</div>}
                />
                <Route
                    exact
                    path={SLUGS.AddAdmin}
                    component={AddAdmin}
                    render={() => <div>Admin</div>}
                />
                <Route
                    exact
                    path={SLUGS.PdfDetail}
                    component={PdfDetail}
                    render={() => <div>PdfDetail</div>}
                />
                <Route exact path={SLUGS.settings} render={() => <div>settings</div>} />
                <Route
                    exact
                    path={SLUGS.categoryImages}
                    component={CategoryImages}
                    render={() => <div>CategoryImages</div>}
                />
                <Route exact path={SLUGS.privacyPolicy} component={PrivacyPolicy} />
                <Route exact path={SLUGS.FeedBack} component={FeedBackList} />
                <Route exact path={SLUGS.AddProduct} component={AddProduct} />
                <Route exact path='/' component={DashboardComponent} />
                {/* render={() => <div>PrivacyPolicy</div>} */}
                <Redirect to={SLUGS.dashboard} component={DashboardComponent} />
            </Switch>
        </Suspense>
    );
}

export default PrivateRoutes;
