import Router from 'ampersand-router';
import qs from 'qs';
import actions from './actions';
const {
    navigatePage,
    gotoUserPage
} = actions;


export default Router.extend({
    initialize(options) {
        options.store.subscribe(() => {
            const {ui} = options.store.getState();

            this.navigate(ui.get('route'), {trigger: false});
        });
        this.store = options.store;
    },
    routes: {
        '': 'home',
        '/': 'home',
        'user/:account': 'userpage'
    },
    home() {
        this.store.dispatch(navigatePage({page:'home', route:'/'}));
    },
    userpage(account) {
        this.store.dispatch(gotoUserPage(account));
    }
});
