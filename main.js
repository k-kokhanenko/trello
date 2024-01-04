let draggedCard = null;
	
function RestoreStateFromStorage() {
	const columnsData = JSON.parse(localStorage.getItem('columnsData'));
	if (Array.isArray(columnsData)) {
		let i = 0;
		const columns = document.querySelectorAll('article.tile');
		if (columns) {
			columns.forEach((column) => {	
				const button = column.querySelector('.button');
				
				if (button && Array.isArray(columnsData[i])) {								
					columnsData[i].forEach((content) => {
						addNewBlock(button, content);															
					});
				}
				
				i++;
			});
		}	
	}
}

function updateCurrentState() {
	const columnsData = [];
	const columns = document.querySelectorAll('article.tile');
	if (columns) {
		columns.forEach((column) => {					
			const blocksContent = [];
			const blocks = column.querySelectorAll('.card');
			if (blocks) {
				blocks.forEach((block) => {			
					blocksContent.push(block.textContent);
				});	
				
				columnsData.push(blocksContent);
			}
		});
			
		localStorage.setItem('columnsData', JSON.stringify(columnsData));
	}
}

function deleteSelectedBlock(block) {
	if (block) {
		block.remove();	
		updateCurrentState();
	}
}

function addNewBlock(button, content = '') {
	if (button) {
		const block = document.createElement("div");
		block.className = "box card";			 
		block.draggable = true;
		block.textContent = content ? content : "new block, double-click to change the content.";		
		button.before(block);
		
		block.addEventListener('click', onCloseBlock);		
		block.addEventListener('dblclick', onChangeBlockContent);
		block.addEventListener('input', updateCurrentState);		
				
						
		block.addEventListener('dragstart', dragStart);
		block.addEventListener('dragenter', dragEnter);
		block.addEventListener('dragover', dragOver);
		block.addEventListener('dragleave', dragLeave);
		block.addEventListener('drop', dragDrop);
		block.addEventListener('dragend', dragEnd);	
				
		updateCurrentState();	
	}
}

function onCloseBlock(e) {
	if (e.offsetX >= e.target.offsetWidth - 20 && 
		e.offsetX <= e.target.offsetWidth - 10 &&
		e.offsetY >= 10 && e.offsetY <= 20) {
			deleteSelectedBlock(e.target);
	}
}

function onChangeBlockContent(e) {
	const block = e.target;
	
	block.setAttribute('contenteditable', 'true');
	block.focus();
	document.execCommand('selectAll');

	block.addEventListener('blur', function() {
		block.removeAttribute('contenteditable');
	});	
}

function dragStart() {
	draggedCard = this;

	setTimeout(() => {
		this.style.display = 'none';
	}, 0);
}

function dragEnter(e) {
	e.preventDefault();
	this.classList.add('drag-over');
}

function dragOver(e) {
	e.preventDefault();
}

function dragLeave() {
	this.classList.remove('drag-over');
}

function dragDrop() {
	this.classList.remove('drag-over');
	this.parentNode.insertBefore(draggedCard, this);
	updateCurrentState();
}

function dragEnd() {
	this.style.display = 'block';
	draggedCard = null;
	updateCurrentState();
}	


document.addEventListener("DOMContentLoaded", () => {
	RestoreStateFromStorage();
	
	const buttons = document.querySelectorAll('.button');
	buttons.forEach((button) => {			
		button.addEventListener('click', (e) => {
			addNewBlock(e.target);
		});
	});		
});
