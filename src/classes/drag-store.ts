export default class DragStore<T> {
    storeMap: Map<T, Set<Node>> = new Map;
    dragOverClass: String = ''

    constructor(dragOverClass: String) {
        this.dragOverClass = dragOverClass
    }

    handleEnter(event: DragEvent, id: T): void {
        const store = this.getStoreById(id)

        if (store.size || event.currentTarget === event.target) {
            store.add(<Node> event.target)
        }

        if (store.size === 1) {
            const element: HTMLElement = <HTMLElement> event.currentTarget
            element.classList.add(<string> this.dragOverClass)
        }
    }

    handleLeave(event: DragEvent, id: T): void {
        const store = this.getStoreById(id)
        store.delete(<Node> event.target)

        if (store.size === 0) {
            const element: HTMLElement = <HTMLElement> event.currentTarget
            element.classList.remove(<string> this.dragOverClass)
        }
    }

    handleDrop(event: DragEvent, id: T): void {
        const store = this.getStoreById(id)
        store.clear()
        this.handleLeave(event, id)
    }

    getStoreById(id: any): Set<Node> {
        if (!this.storeMap.has(id)) {
            this.storeMap.set(id, new Set)
        }

        return this.storeMap.get(id)
    }

    isDraggingOver(id: T): Boolean {
        const store = this.getStoreById(id)
        return Boolean(store.size)
    }
}