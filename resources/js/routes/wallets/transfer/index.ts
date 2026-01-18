import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\WalletTransferController::store
 * @see app/Http/Controllers/WalletTransferController.php:13
 * @route '/wallets/transfer'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/wallets/transfer',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletTransferController::store
 * @see app/Http/Controllers/WalletTransferController.php:13
 * @route '/wallets/transfer'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletTransferController::store
 * @see app/Http/Controllers/WalletTransferController.php:13
 * @route '/wallets/transfer'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WalletTransferController::store
 * @see app/Http/Controllers/WalletTransferController.php:13
 * @route '/wallets/transfer'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WalletTransferController::store
 * @see app/Http/Controllers/WalletTransferController.php:13
 * @route '/wallets/transfer'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const transfer = {
    store: Object.assign(store, store),
}

export default transfer