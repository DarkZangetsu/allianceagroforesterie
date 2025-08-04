class DisableCSRFMiddleware:
    """
    Middleware qui désactive complètement la vérification CSRF
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Marquer la requête comme exempt de CSRF
        setattr(request, '_dont_enforce_csrf_checks', True)
        
        response = self.get_response(request)
        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        # S'assurer que toutes les vues sont exemptées de CSRF
        setattr(request, '_dont_enforce_csrf_checks', True)
        return None