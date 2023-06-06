const hamburger = () => {

        let menuBtnLeft = document.querySelector('.header_left');
        let menuLeft = document.querySelector('.menuLeft');
        let menuBtnRight = document.querySelector('.header_right');
        let menuRight = document.querySelector('.menuRight');
        let openMenuLeft = false;
        let openMenuRight = false;
        let shadowOverlay;

        addListeners();

        function addListeners() {
            menuBtnLeft.addEventListener('click', function(){
                if (!openMenuRight) {
                    overlayMenu();
                    toogleLeftMenu();  
                }
            });
    
            menuBtnRight.addEventListener('click', function(){
                if (!openMenuLeft) {
                    overlayMenu();
                    toogleRightMenu();
                }
            });
    
            window.addEventListener('click', e => {
                if (e.target.classList.contains('overlay__shadow')) {
                    closeOverlay();
                }
            });
    
            window.addEventListener('keydown', e => {
                if ((e.key === 'Escape') & ((openMenuLeft) || (openMenuRight))) {
                    closeOverlay();
                }
            });
    
            document.querySelector('.chatcontent').scrollTo(0, document.body.scrollHeight);
        }

        function closeOverlay() {
                if (openMenuLeft) {
                    overlayMenu();
                    toogleLeftMenu();  
                }
                if (openMenuRight) {
                    overlayMenu();
                    toogleRightMenu();
                }
        }

        function toogleLeftMenu() {
            (!openMenuLeft) ? openMenuLeft = true : openMenuLeft = false;
            menuLeft.classList.toggle('active');
            menuBtnLeft.classList.toggle('active');
        } 

        function toogleRightMenu() {
            (!openMenuRight) ? openMenuRight = true : openMenuRight = false;
            menuRight.classList.toggle('active');
            menuBtnRight.classList.toggle('active');
        } 

        function overlayMenu() { 
            if ((!openMenuRight) & (!openMenuLeft)) {
                shadowOverlay = document.createElement('div');
                shadowOverlay.classList.add('overlay__shadow');
                document.body.appendChild(shadowOverlay);
                shadowOverlay.classList.add('overlay__shadow--show');
            } else {
                shadowOverlay.classList.remove('overlay__shadow--show');
                shadowOverlay.classList.remove('overlay__shadow');
                document.body.removeChild(shadowOverlay);
            }
        }
};

export default hamburger;