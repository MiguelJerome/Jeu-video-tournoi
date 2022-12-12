let buttonCookie = document.getElementById('button-cookie');
let messageCookie = document.getElementById('message-cookie');
/**
 * Si l'utilisateur accepte, il confirme l'utilisation des
 * cookies et le message disparait
 */
if(buttonCookie) {
    buttonCookie.addEventListener('click', async () => {
        let response = await fetch('/accept', {
            method: 'POST'
        })

        if(response.ok) {
            messageCookie.remove();
        }
    });
}
