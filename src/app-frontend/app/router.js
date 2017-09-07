import Router from 'ampersand-router';
import qs from 'qs';
import actions from './actions';
const {
    navigatePage,
    gotoUserPage,
    gotoPost
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
        'landing':'landing',
        'debug' : 'debug',
        'user/:account': 'userpage',
        'post/authorg/:authorg/sub/:subHash/rev/:revHash' : 'post'
    },
    home() {
        this.store.dispatch(navigatePage({page:'home', route:'/'}));
    },
    userpage(account) {
        this.store.dispatch(gotoUserPage(account));
    },
    debug() {
        this.store.dispatch(navigatePage({page:'debug', route:'/debug'}));
    },
    landing() {
        this.store.dispatch(navigatePage({page:'landing',route:'/landing'}));
    },
    post(authorg, subHash, revHash) {
        this.store.dispatch(gotoPost(authorg, subHash, revHash));
    }
});
