import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\RecurringTemplateController::index
 * @see app/Console/Commands/ProcessRecurringTransactions.php:14
 * @route '/recurring'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/recurring',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RecurringTemplateController::index
 * @see app/Console/Commands/ProcessRecurringTransactions.php:14
 * @route '/recurring'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecurringTemplateController::index
 * @see app/Console/Commands/ProcessRecurringTransactions.php:14
 * @route '/recurring'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RecurringTemplateController::index
 * @see app/Console/Commands/ProcessRecurringTransactions.php:14
 * @route '/recurring'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\RecurringTemplateController::index
 * @see app/Console/Commands/ProcessRecurringTransactions.php:14
 * @route '/recurring'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\RecurringTemplateController::index
 * @see app/Console/Commands/ProcessRecurringTransactions.php:14
 * @route '/recurring'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\RecurringTemplateController::index
 * @see app/Console/Commands/ProcessRecurringTransactions.php:14
 * @route '/recurring'
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
* @see \App\Http\Controllers\RecurringTemplateController::store
 * @see app/Console/Commands/ProcessRecurringTransactions.php:31
 * @route '/recurring'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/recurring',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RecurringTemplateController::store
 * @see app/Console/Commands/ProcessRecurringTransactions.php:31
 * @route '/recurring'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecurringTemplateController::store
 * @see app/Console/Commands/ProcessRecurringTransactions.php:31
 * @route '/recurring'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\RecurringTemplateController::store
 * @see app/Console/Commands/ProcessRecurringTransactions.php:31
 * @route '/recurring'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecurringTemplateController::store
 * @see app/Console/Commands/ProcessRecurringTransactions.php:31
 * @route '/recurring'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\RecurringTemplateController::update
 * @see app/Console/Commands/ProcessRecurringTransactions.php:0
 * @route '/recurring/{recurring}'
 */
export const update = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/recurring/{recurring}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\RecurringTemplateController::update
 * @see app/Console/Commands/ProcessRecurringTransactions.php:0
 * @route '/recurring/{recurring}'
 */
update.url = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurring: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    recurring: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        recurring: args.recurring,
                }

    return update.definition.url
            .replace('{recurring}', parsedArgs.recurring.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecurringTemplateController::update
 * @see app/Console/Commands/ProcessRecurringTransactions.php:0
 * @route '/recurring/{recurring}'
 */
update.put = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\RecurringTemplateController::update
 * @see app/Console/Commands/ProcessRecurringTransactions.php:0
 * @route '/recurring/{recurring}'
 */
update.patch = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\RecurringTemplateController::update
 * @see app/Console/Commands/ProcessRecurringTransactions.php:0
 * @route '/recurring/{recurring}'
 */
    const updateForm = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecurringTemplateController::update
 * @see app/Console/Commands/ProcessRecurringTransactions.php:0
 * @route '/recurring/{recurring}'
 */
        updateForm.put = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\RecurringTemplateController::update
 * @see app/Console/Commands/ProcessRecurringTransactions.php:0
 * @route '/recurring/{recurring}'
 */
        updateForm.patch = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\RecurringTemplateController::destroy
 * @see app/Console/Commands/ProcessRecurringTransactions.php:51
 * @route '/recurring/{recurring}'
 */
export const destroy = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/recurring/{recurring}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RecurringTemplateController::destroy
 * @see app/Console/Commands/ProcessRecurringTransactions.php:51
 * @route '/recurring/{recurring}'
 */
destroy.url = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { recurring: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    recurring: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        recurring: args.recurring,
                }

    return destroy.definition.url
            .replace('{recurring}', parsedArgs.recurring.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RecurringTemplateController::destroy
 * @see app/Console/Commands/ProcessRecurringTransactions.php:51
 * @route '/recurring/{recurring}'
 */
destroy.delete = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\RecurringTemplateController::destroy
 * @see app/Console/Commands/ProcessRecurringTransactions.php:51
 * @route '/recurring/{recurring}'
 */
    const destroyForm = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\RecurringTemplateController::destroy
 * @see app/Console/Commands/ProcessRecurringTransactions.php:51
 * @route '/recurring/{recurring}'
 */
        destroyForm.delete = (args: { recurring: string | number } | [recurring: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const recurring = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default recurring