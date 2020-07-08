const signInBtn = document.getElementById('sign-in-btn');
const signOutBtn = document.getElementById('sign-out-btn');
document.querySelector('body').classList = 'not-logged-in';
signOutBtn.style.display = 'none';

function onSignIn(googleUser) {
    fetch('/sign-in', {
        method: 'post',
        body: JSON.stringify({token: googleUser.getAuthResponse().id_token}),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(resp => {
        resp.json().then(r => {
            signInBtn.style.display = 'none';
            // signOutBtn.querySelector('span').textContent = r.name;
            signOutBtn.querySelector('img').src = r.profileImgUrl;
            signOutBtn.style.display = 'inline-flex';
            document.querySelector('body').classList = 'logged-in';
        });
    });
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        signOutBtn.style.display = 'none';
        signInBtn.style.display = 'inline-flex';
        fetch('/sign-out');
        $Router.hash('#home');
        document.querySelector('body').classList = 'not-logged-in';
    });
}
function singInWithGoogle() {
    document.querySelector('.g-signin2 div').click();
}