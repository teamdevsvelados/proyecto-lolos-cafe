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
