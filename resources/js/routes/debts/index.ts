import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\DebtController::pay
 * @see app/Http/Controllers/DebtController.php:56
 * @route '/debts/{id}/pay'
 */
export const pay = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

pay.definition = {
    methods: ["post"],
    url: '/debts/{id}/pay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DebtController::pay
 * @see app/Http/Controllers/DebtController.php:56
 * @route '/debts/{id}/pay'
 */
pay.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return pay.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DebtController::pay
 * @see app/Http/Controllers/DebtController.php:56
 * @route '/debts/{id}/pay'
 */
pay.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pay.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DebtController::pay
 * @see app/Http/Controllers/DebtController.php:56
 * @route '/debts/{id}/pay'
 */
    const payForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: pay.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DebtController::pay
 * @see app/Http/Controllers/DebtController.php:56
 * @route '/debts/{id}/pay'
 */
        payForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: pay.url(args, options),
            method: 'post',
        })
    
    pay.form = payForm
/**
* @see \App\Http\Controllers\DebtController::index
 * @see app/Http/Controllers/DebtController.php:15
 * @route '/debts'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/debts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DebtController::index
 * @see app/Http/Controllers/DebtController.php:15
 * @route '/debts'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DebtController::index
 * @see app/Http/Controllers/DebtController.php:15
 * @route '/debts'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\DebtController::index
 * @see app/Http/Controllers/DebtController.php:15
 * @route '/debts'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\DebtController::index
 * @see app/Http/Controllers/DebtController.php:15
 * @route '/debts'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\DebtController::index
 * @see app/Http/Controllers/DebtController.php:15
 * @route '/debts'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\DebtController::index
 * @see app/Http/Controllers/DebtController.php:15
 * @route '/debts'
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
* @see \App\Http\Controllers\DebtController::store
 * @see app/Http/Controllers/DebtController.php:36
 * @route '/debts'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/debts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DebtController::store
 * @see app/Http/Controllers/DebtController.php:36
 * @route '/debts'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DebtController::store
 * @see app/Http/Controllers/DebtController.php:36
 * @route '/debts'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\DebtController::store
 * @see app/Http/Controllers/DebtController.php:36
 * @route '/debts'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DebtController::store
 * @see app/Http/Controllers/DebtController.php:36
 * @route '/debts'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\DebtController::update
 * @see app/Http/Controllers/DebtController.php:0
 * @route '/debts/{debt}'
 */
export const update = (args: { debt: string | number } | [debt: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/debts/{debt}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\DebtController::update
 * @see app/Http/Controllers/DebtController.php:0
 * @route '/debts/{debt}'
 */
update.url = (args: { debt: string | number } | [debt: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { debt: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    debt: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        debt: args.debt,
                }

    return update.definition.url
            .replace('{debt}', parsedArgs.debt.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DebtController::update
 * @see app/Http/Controllers/DebtController.php:0
 * @route '/debts/{debt}'
 */
update.put = (args: { debt: string | number } | [debt: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\DebtController::update
 * @see app/Http/Controllers/DebtController.php:0
 * @route '/debts/{debt}'
 */
update.patch = (args: { debt: string | number } | [debt: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\DebtController::update
 * @see app/Http/Controllers/DebtController.php:0
 * @route '/debts/{debt}'
 */
    const updateForm = (args: { debt: string | number } | [debt: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DebtController::update
 * @see app/Http/Controllers/DebtController.php:0
 * @route '/debts/{debt}'
 */
        updateForm.put = (args: { debt: string | number } | [debt: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\DebtController::update
 * @see app/Http/Controllers/DebtController.php:0
 * @route '/debts/{debt}'
 */
        updateForm.patch = (args: { debt: string | number } | [debt: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\DebtController::destroy
 * @see app/Http/Controllers/DebtController.php:100
 * @route '/debts/{debt}'
 */
export const destroy = (args: { debt: number | { id: number } } | [debt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/debts/{debt}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DebtController::destroy
 * @see app/Http/Controllers/DebtController.php:100
 * @route '/debts/{debt}'
 */
destroy.url = (args: { debt: number | { id: number } } | [debt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { debt: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { debt: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    debt: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        debt: typeof args.debt === 'object'
                ? args.debt.id
                : args.debt,
                }

    return destroy.definition.url
            .replace('{debt}', parsedArgs.debt.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DebtController::destroy
 * @see app/Http/Controllers/DebtController.php:100
 * @route '/debts/{debt}'
 */
destroy.delete = (args: { debt: number | { id: number } } | [debt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\DebtController::destroy
 * @see app/Http/Controllers/DebtController.php:100
 * @route '/debts/{debt}'
 */
    const destroyForm = (args: { debt: number | { id: number } } | [debt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\DebtController::destroy
 * @see app/Http/Controllers/DebtController.php:100
 * @route '/debts/{debt}'
 */
        destroyForm.delete = (args: { debt: number | { id: number } } | [debt: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const debts = {
    pay: Object.assign(pay, pay),
index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default debts