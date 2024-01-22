document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const uploadForm = document.getElementById('upload-image-form');
    const resultsContainer = document.getElementById('results');

    // Handle image search
    searchForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        resultsContainer.innerHTML = 'Searching...';

        const formData = new FormData();
        formData.append('image', document.getElementById('search-image-input').files[0]);

        try {
            const response = await fetch('/search', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Search failed');

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Error:', error);
            resultsContainer.innerHTML = '<p>Error while searching for the image.</p>';
        }
    });

    // Handle new image uploads
    uploadForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const formData = new FormData(uploadForm);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Upload failed');

            alert(await response.text());
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading images');
        }
    });

    function displayResults(data) {
        resultsContainer.innerHTML = '';
        if (data && data.length > 0) {
            data.forEach(item => {
                const img = document.createElement('img');
                img.src = `data:image/jpeg;base64,${item.image}`;
                resultsContainer.appendChild(img);
            });
        } else {
            resultsContainer.innerHTML = '<p>No results found.</p>';
        }
    }
});




