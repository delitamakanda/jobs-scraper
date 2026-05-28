import collections
from django.core.paginator import EmptyPage, PageNotAnInteger

class CountlessPage(collections.abc.Sequence):
    """
    A page object that does not know the total number of items or pages. It only knows if there is a next page or a previous page based on the number of items it has.
    """

    def __init__(self, object_list, per_page, page_size=None):
        self.object_list = list(object_list)
        self.per_page = per_page
        self.page_size = page_size
        self._has_next = len(self.object_list) > page_size
        self._has_previous = per_page > 1
        self.object_count = self.object_list[:page_size]

    def __len__(self):
        return len(self.object_list)

    def __getitem__(self, index):
        return self.object_list[index]

    def has_next(self):
        return self._has_next
    def has_previous(self):
        return self._has_previous
    def next_page_number(self):
        if self._has_next:
            return self.per_page + 1
        raise EmptyPage("No next page.")
    def previous_page_number(self):
        if self._has_previous:
            return self.per_page - 1
        raise EmptyPage("No previous page.")
    
class CountlessPaginator:
    def __init__(self, object_list, per_page):
        self.object_list = object_list
        self.per_page = per_page

    def page(self, number):
        try:
            number = int(number)
            if number < 1:
                raise ValueError("Page number must be a positive integer.")
        except (TypeError, ValueError):
            raise PageNotAnInteger("Page number is not an integer.")
        
        bottom = (number - 1) * self.per_page
        top = bottom + self.per_page + 1
        return CountlessPage(self.object_list[bottom:top], number, self.per_page)
    
    def get_page(self, number):
        try:
            return self.page(number)
        except EmptyPage:
            return self.page(1)
        
