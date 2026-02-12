"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByProperty = void 0;
function sortByProperty(arr, property, direction = 'asc') {
    return arr.sort((a, b) => {
        const aValue = property.split('.').reduce((acc, prop) => acc[prop], a);
        const bValue = property.split('.').reduce((acc, prop) => acc[prop], b);
        if (aValue == null && bValue == null)
            return 0;
        if (aValue == null)
            return direction === 'asc' ? -1 : 1;
        if (bValue == null)
            return direction === 'asc' ? 1 : -1;
        if (property === 'createdate') {
            return direction === 'desc'
                ? new Date(bValue).getTime() - new Date(aValue).getTime()
                : new Date(aValue).getTime() - new Date(bValue).getTime();
        }
        else {
            return direction === 'asc'
                ? String(aValue).localeCompare(String(bValue))
                : String(bValue).localeCompare(String(aValue));
        }
    });
}
exports.sortByProperty = sortByProperty;
//# sourceMappingURL=helpers.js.map