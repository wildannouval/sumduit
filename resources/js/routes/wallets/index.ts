import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import transfer from './transfer'
/**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:12
 * @route '/wallets'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/wallets',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:12
 * @route '/wallets'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:12
 * @route '/wallets'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:12
 * @route '/wallets'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:12
 * @route '/wallets'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:12
 * @route '/wallets'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\WalletController::index
 * @see app/Http/Controllers/WalletController.php:12
 * @route '/wallets'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:29
 * @route '/wallets'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/wallets',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:29
 * @route '/wallets'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:29
 * @route '/wallets'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:29
 * @route '/wallets'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WalletController::store
 * @see app/Http/Controllers/WalletController.php:29
 * @route '/wallets'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\WalletController::update
 * @see app/Http/Controllers/WalletController.php:46
 * @route '/wallets/{wallet}'
 */
export const update = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/wallets/{wallet}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\WalletController::update
 * @see app/Http/Controllers/WalletController.php:46
 * @route '/wallets/{wallet}'
 */
update.url = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { wallet: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { wallet: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    wallet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        wallet: typeof args.wallet === 'object'
                ? args.wallet.id
                : args.wallet,
                }

    return update.definition.url
            .replace('{wallet}', parsedArgs.wallet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::update
 * @see app/Http/Controllers/WalletController.php:46
 * @route '/wallets/{wallet}'
 */
update.put = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\WalletController::update
 * @see app/Http/Controllers/WalletController.php:46
 * @route '/wallets/{wallet}'
 */
update.patch = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\WalletController::update
 * @see app/Http/Controllers/WalletController.php:46
 * @route '/wallets/{wallet}'
 */
    const updateForm = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WalletController::update
 * @see app/Http/Controllers/WalletController.php:46
 * @route '/wallets/{wallet}'
 */
        updateForm.put = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\WalletController::update
 * @see app/Http/Controllers/WalletController.php:46
 * @route '/wallets/{wallet}'
 */
        updateForm.patch = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\WalletController::destroy
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallets/{wallet}'
 */
export const destroy = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/wallets/{wallet}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\WalletController::destroy
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallets/{wallet}'
 */
destroy.url = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { wallet: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { wallet: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    wallet: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        wallet: typeof args.wallet === 'object'
                ? args.wallet.id
                : args.wallet,
                }

    return destroy.definition.url
            .replace('{wallet}', parsedArgs.wallet.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\WalletController::destroy
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallets/{wallet}'
 */
destroy.delete = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\WalletController::destroy
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallets/{wallet}'
 */
    const destroyForm = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\WalletController::destroy
 * @see app/Http/Controllers/WalletController.php:62
 * @route '/wallets/{wallet}'
 */
        destroyForm.delete = (args: { wallet: number | { id: number } } | [wallet: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const wallets = {
    transfer: Object.assign(transfer, transfer),
index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default wallets