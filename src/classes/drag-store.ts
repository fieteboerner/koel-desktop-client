export default class DragStore {
    store: Object = {}
    dragOverClass: String = ''

    constructor(dragOverClass: String) {
        this.dragOverClass = dragOverClass
    }

    handleEnter(event: DragEvent, id): void {
        const store = this.getStoreById(id)

        if (store.size || event.currentTarget === event.target) {
            store.add(<Node> event.target)
        }

        if (store.size === 1) {
            const element: HTMLElement = <HTMLElement> event.currentTarget
            element.classList.add(<string> this.dragOverClass)
        }
    }

    handleLeave(event: DragEvent, id): void {
        const store = this.getStoreById(id)
        store.delete(<Node> event.target)

        if (store.size === 0) {
            const element: HTMLElement = <HTMLElement> event.currentTarget
            element.classList.remove(<string> this.dragOverClass)
        }
    }

    handleDrop(event: DragEvent, id): void {
        const store = this.getStoreById(id)
        store.clear()
        this.handleLeave(event, id)
    }

    hasStoreForId(id): Boolean {
        return this.store.hasOwnProperty(id)
    }

    getStoreById(id): Set<Node> {
        if (!this.hasStoreForId(id)) {
            this.store[id] = new Set()
        }

        return this.store[id]
    }

    isDraggingOver(id): Boolean {
        const store = this.getStoreById(id)
        return Boolean(store.size)
    }
}