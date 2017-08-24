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
        'debug' : 'debug',
        'user/:account': 'userpage',
        'post/:subHash/rev/:revHash' : 'post'
    },
    home() {
        this.store.dispatch(navigatePage({page:'home', route:'/'}));
    },
    userpage(account) {
        this.store.dispatch(gotoUserPage(account));
    },
    debug() {
        this.store.dispatch(navigatePage({page:'debug', route:'/'}));
    },
    post(subHash,revHash) {
        this.store.dispatch(navigatePage({page:'post', route: '\/post\/' + subHash + '\/rev\/' + revHash}));
    }
});
