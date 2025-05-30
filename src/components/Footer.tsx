"use client";
export default function Footer() {
	return (
		<footer className="py-3 mt-auto">
			<div className="container text-center">
				<small>&copy; {new Date().getFullYear()} ContactApp</small>
				<p>Background photo by <a href="https://unsplash.com/@hello_ali" target="_blank" rel="noopener noreferrer">Ali Elliott</a> on <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a></p>
			</div>
		</footer>
	);
}
