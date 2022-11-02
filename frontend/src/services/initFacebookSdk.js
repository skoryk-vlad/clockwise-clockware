export function initFacebookSdk() {
    window.fbAsyncInit = function () {
        window.FB.init({
            appId: process.env.REACT_APP_FACEBOOK_ID,
            cookie: true,
            xfbml: true,
            version: 'v15.0'
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}