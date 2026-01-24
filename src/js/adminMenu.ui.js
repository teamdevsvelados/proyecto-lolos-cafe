// public/js/product-image-dropzone.js
(function () {
	const dropzone = document.getElementById("imageDropzone");
	const input = document.getElementById("productImage");
	const content = document.getElementById("dropzoneContent");
	const previewW = document.getElementById("previewWrapper");
	const preview = document.getElementById("previewImage");
	const errBox = document.getElementById("imageError");
	const changeBtn = document.getElementById("changeImageBtn");
	const removeBtn = document.getElementById("removeImageBtn");

	if (!dropzone || !input) return; // Avoid errors if the block doesn't exist on this page	
		const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
	const VALID_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];	
	function showError(msg) {
		errBox.textContent = msg;
		errBox.classList.remove("d-none");
		dropzone.classList.add("is-invalid", "border-danger");
	}
	function clearError() {
		errBox.textContent = "";
		errBox.classList.add("d-none");
		dropzone.classList.remove("is-invalid", "border-danger");
	}
	function toPreview(file) {
		clearError();
		const url = URL.createObjectURL(file);
		preview.src = url;
		content.classList.add("d-none");
		previewW.classList.remove("d-none");
	}
	function resetPreview() {
		input.value = "";
		if (preview.src) URL.revokeObjectURL(preview.src);
		preview.removeAttribute("src");
		previewW.classList.add("d-none");
		content.classList.remove("d-none");
		clearError();
	}
	function validate(file) {
		if (!file) return;
		if (!VALID_TYPES.includes(file.type)) {
			showError("Formato no soportado. Usa JPG, PNG, GIF o WEBP.");
			return false;
		}
		if (file.size > MAX_SIZE) {
			showError("El archivo supera 5 MB. Selecciona una imagen más ligera.");
			return false;
		}
		return true;
	}
	function handleFiles(files) {
		const file = files && files[0];
		if (!file) return;
		if (!validate(file)) return;
		toPreview(file);
	}

	// Click on dropzone opens the file input
	dropzone.addEventListener("click", () => input.click());

	// Accessibility: Enter/Space activate
	dropzone.addEventListener("keydown", (e) => {
		if (e.key === "Enter" || e.key === " ") {
     	e.preventDefault();
     	input.click();
	}});

	// Changes from the file picker
	input.addEventListener("change", (e) => handleFiles(e.target.files));

  // Drag & drop
	["dragenter", "dragover"].forEach((evt) =>
		dropzone.addEventListener(evt, (e) => {
     		e.preventDefault();
     		e.stopPropagation();
     		dropzone.classList.add("dragover");
		}),
	);
	["dragleave", "drop"].forEach((evt) =>
		dropzone.addEventListener(evt, (e) => {
     		e.preventDefault();
     		e.stopPropagation();
     		dropzone.classList.remove("dragover");
		}),
	);
	dropzone.addEventListener("drop", (e) => {
		const dt = e.dataTransfer;
		if (!dt || !dt.files) return;
		handleFiles(dt.files);
	});

  // Action buttons
	changeBtn?.addEventListener("click", () => input.click());
	removeBtn?.addEventListener("click", resetPreview);
})();


const links = document.querySelectorAll('.nav-admin-sidebar .nav-link');
links.forEach(a => {
	a.addEventListener('click', () => {
	links.forEach(x => x.classList.remove('active'));
	a.classList.add('active');
	});
});

// The price field only appears if you select the size.
document.querySelectorAll('.size-check').forEach(check => {
  check.addEventListener('change', function () {
    const input = document.getElementById(this.dataset.target);

    if (this.checked) {
      input.classList.remove('d-none');
      input.required = true;
    } else {
      input.classList.add('d-none'); //display none, here it is added and then the input is hidden
      input.value = '';
      input.required = false;
    }
  });
});

// // Function to handle toggle between drinks and desserts
// function setupProductTypeToggle() {
//   const drinkRadio = document.querySelector('input[name="product-type"][value="drink"]');
//   const dessertRadio = document.querySelector('input[name="product-type"][value="dessert"]');
//   const drinkSection = document.getElementById('drink-section');
  
//   if (!drinkRadio || !dessertRadio || !drinkSection) return;
  
//   // Create dessert section if it doesn't exist
//   let dessertSection = document.getElementById('dessert-section');
//   if (!dessertSection) {
//     dessertSection = document.createElement('div');
//     dessertSection.id = 'dessert-section';
//     dessertSection.style.display = 'none';
//     dessertSection.innerHTML = `
//       <label class="form-label"><strong>Sección</strong></label>
//       <select id="dessert-category" class="form-select mb-3">
//         <option>Postres</option>
//         <option>Extras</option>
//         <option>Promociones</option>
//       </select>
      
//       <div class="mb-3">
//         <label for="dessert-unit-price" class="form-label"><strong>Precio por unidad</strong></label>
//         <input type="number" id="dessert-unit-price" class="form-control" placeholder="$0.00" min="0" step="0.01">
//       </div>
      
//       <div class="mb-3">
//         <label for="dessert-slice-price" class="form-label"><strong>Precio por rebanada (opcional)</strong></label>
//         <input type="number" id="dessert-slice-price" class="form-control" placeholder="$0.00" min="0" step="0.01">
//       </div>
//     `;
    
//     // Insert after the drinks section
//     drinkSection.parentNode.insertBefore(dessertSection, drinkSection.nextSibling);
//   }
  
//   // Handle changes
//   drinkRadio.addEventListener('change', () => {
//     drinkSection.style.display = 'block';
//     dessertSection.style.display = 'none';
//   });
  
//   dessertRadio.addEventListener('change', () => {
//     drinkSection.style.display = 'none';
//     dessertSection.style.display = 'block';
//   });
// }

// // Call when the DOM is ready
// document.addEventListener('DOMContentLoaded', setupProductTypeToggle);