fetch('/src/components/header.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('header-placeholder').innerHTML = html;
    });
fetch('/src/components/footer.html')
    .then(response => response.text())
    .then(html => {
        const footer = document.getElementById('footer-placeholder')
        if(footer) {
            footer.innerHTML = html
        }
    });
fetch('/src/components/sidebar-nav.html')
    .then(response => response.text())
    .then(html => {
        const sidebar = document.getElementById('sidebar-placeholder')
        if(sidebar) {
            sidebar.innerHTML = html
        }
    });