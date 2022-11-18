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
import AddAdmin from './AddAdmin/AddAdmin';
import CustomerDetail from './customerDetail/customerDetail';
import ViewDraft from './ViewDraft/ViewDraft';
import AddProduct from './AddProduct/AddProduct';

const DashboardComponent = lazy(() => import('./dashboard'));

function PrivateRoutes() {
    return (
        <Suspense fallback={<LoadingComponent loading />}>
            <Switch>
                <Route
                    exact
                    path={SLUGS.UserDetail}
                    component={UserDetail}
                    render={() => <div>userDetail</div>}
                />
                <Route
                    exact
                    path={SLUGS.ViewDraft}
                    component={ViewDraft}
                    render={() => <div>DraftInvoice</div>}
                />
                <Route
                    exact
                    path={SLUGS.CustomerDetail}
                    component={CustomerDetail}
                    render={() => <div>CustomerDetail</div>}
                />
                <Route exact path={SLUGS.dashboard} component={DashboardComponent} />
                <Route
                    exact
                    path={SLUGS.UserList}
                    component={UserList}
                    render={() => <div>UserList</div>}
                />
                <Route exact path={SLUGS.items} component={Items} render={() => <div>items</div>} />
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
                    path={SLUGS.AddAdmin}
                    component={AddAdmin}
                    render={() => <div>Admin</div>}
                />
                <Route exact path={SLUGS.settings} render={() => <div>settings</div>} />
                <Route exact path={SLUGS.privacyPolicy} component={PrivacyPolicy} />
                <Route exact path={SLUGS.FeedBack} component={FeedBackList} />
                <Route exact path={SLUGS.AddProduct} component={AddProduct} />
                <Route exact path='/' component={DashboardComponent} />
                {/* render={() => <div>PrivacyPolicy</div>} */}
                <Redirect to={SLUGS.dashboard} />
            </Switch>
        </Suspense>
    );
}

export default PrivateRoutes;
