export class ProductModalView {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        if (!this.modal) return;

        const sel = (id) => this.modal.querySelector(id);
        this.els = {
            img: sel('#modalImg'), title: sel('#modalTitle'), price: sel('#modalPrice'),
            desc: sel('#modalDescription'), badge: sel('#modalBadge'), qty: sel('#input-cantidad'),
            total: sel('#modal-total-dinamico'), size: sel('#size-options'), temp: sel('#temperature-options'),
            coffeeType: sel('#coffee-type-options'), coffeeTypeSection: sel('#coffee-type-section'),
            milks: sel('#milks-container'), extras: sel('#extras-container'),
            btnMas: sel('#btn-mas') || document.getElementById('btn-mas'),
            btnMenos: sel('#btn-menos') || document.getElementById('btn-menos')
        };
        this.onChangeCb = null;
    }

    renderHeader(pData) {
        if (this.els.img) { this.els.img.src = pData.image; this.els.img.alt = pData.name; }
        if (this.els.title) this.els.title.textContent = pData.name;
        if (this.els.price) this.els.price.textContent = `$${pData.price}`;
        if (this.els.desc) this.els.desc.textContent = pData.description;
        if (this.els.badge) {
            this.els.badge.textContent = `☆ ${pData.badge}`;
            this.els.badge.classList.toggle('d-none', !pData.badge);
        }
        if (this.els.qty) this.els.qty.value = '1';
    }

    clearOptions() {
        ['temp', 'size', 'coffeeType', 'milks', 'extras'].forEach(key => {
            if (this.els[key]) this.els[key].innerHTML = '';
        });
    }

    _radioHtml(name, id, val, label, checked, cls = '') {
        return `<div class="form-check mb-2">
            <input class="form-check-input ${cls}" type="radio" name="${name}" id="${name}-${id}" value="${val}" ${checked ? 'checked' : ''}>
            <label class="form-check-label" for="${name}-${id}">${label}</label>
        </div>`;
    }

    _renderList(container, items, name, cls) {
        if (!container) return;
        container.innerHTML = items.map((item, i) =>
            this._radioHtml(name, item.name.toLowerCase().replace(/\s+/g, '-'), item.price, `${item.name} - $${item.price}`, i === 0, cls)
        ).join('');
        this._attachChangeEvents(`.${cls}`);
    }

    renderCoffeeType(pData, isCoffee) {
        if (!this.els.coffeeType) return;
        const defaults = { withcoffee: 'Regular', withoutcoffee: 'Descafeinado' };
        const data = pData.priceByCoffeeType || (isCoffee ? defaults : null);

        if (this.els.coffeeTypeSection) this.els.coffeeTypeSection.classList.toggle('d-none', !data);
        if (!data) return;

        this.els.coffeeType.innerHTML = Object.keys(data).map((type, i) =>
            this._radioHtml('coffeeType', type, type, defaults[type] || type, i === 0)
        ).join('');
    }

    renderTemperatures(pData, onTempChangeCb) {
        if (!this.els.temp) return;
        const names = { hot: 'Caliente', rocks: 'A las rocas', frappe: 'Frappé' };
        let hasChecked = this.modal.querySelector('input[name="temp"]:checked');

        this.els.temp.innerHTML = Object.keys(pData.priceByTemperature)
            .filter(k => pData.priceByTemperature[k] !== null)
            .map(k => {
                let check = !hasChecked; hasChecked = true;
                return this._radioHtml('temp', k, k, names[k], check);
            }).join('');

        this.modal.querySelectorAll('input[name="temp"]').forEach(inp =>
            inp.addEventListener('change', (e) => onTempChangeCb(e.target.value))
        );
    }

    renderSizes(pData, selectedTemp) {
        if (!this.els.size) return;
        const sizes = pData.priceByTemperature[selectedTemp];
        if (!sizes) return this.els.size.innerHTML = '<p class="text-muted">No tamaños</p>';

        const names = { ch: 'Chico (14 oz.)', md: 'Mediano (16 oz.)', lg: 'Grande (20 oz.)' };
        this.els.size.innerHTML = Object.keys(sizes).map((k, i) =>
            this._radioHtml('size', k, sizes[k], `${names[k]} - $${sizes[k]}`, i === 0, 'size-input')
        ).join('');
        this._attachChangeEvents('.size-input');
    }

    renderDessertSizes(pData) {
        if (!this.els.size) return;
        const names = { slice: 'Rebanada', full: 'Entero' };
        this.els.size.innerHTML = Object.keys(pData.priceBySize).map((k, i) =>
            this._radioHtml('size', k, pData.priceBySize[k], `${names[k]} - $${pData.priceBySize[k]}`, i === 0, 'size-input')
        ).join('');
        this._attachChangeEvents('.size-input');
    }

    renderMilks(milks) { this._renderList(this.els.milks, milks, 'milk', 'add-on-input'); }
    renderExtras(extras) { this._renderList(this.els.extras, extras, 'extra', 'add-on-input'); }

    bindChangeEvents(cb) {
        this.onChangeCb = cb;
        const setupBtn = (btnKey, isAdd) => {
            if (!this.els[btnKey]) return;
            const newBtn = this.els[btnKey].cloneNode(true);
            this.els[btnKey].replaceWith(newBtn);
            this.els[btnKey] = newBtn;
            newBtn.addEventListener('click', () => {
                let v = parseInt(this.els.qty.value) || 1;
                if (isAdd) v++; else if (v > 1) v--;
                this.els.qty.value = v;
                this.onChangeCb();
            });
        };
        setupBtn('btnMas', true);
        setupBtn('btnMenos', false);
    }

    _attachChangeEvents(sel) {
        this.modal.querySelectorAll(sel).forEach(inp =>
            inp.addEventListener('change', () => this.onChangeCb && this.onChangeCb())
        );
    }

    updateTotalDisplay(total) {
        if (this.els.total) this.els.total.textContent = `$ ${total.toFixed(2)}`;
    }

    getSelections() {
        const val = (name) => {
            const el = this.modal.querySelector(`input[name="${name}"]:checked`);
            return el ? Number(el.value) : 0;
        };
        return {
            sizePrice: val('size'), milkPrice: val('milk'), extraPrice: val('extra'),
            quantity: this.els.qty ? (parseInt(this.els.qty.value) || 1) : 1
        };
    }
}
