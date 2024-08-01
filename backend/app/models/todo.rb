class Todo < ApplicationRecord
    validates :title, presence: true
    validates :completed, inclusion: { in: [true, false] }

    default_scope { order(position: :asc) }
    before_create :set_position

    private

    def set_position
      last_position = Todo.maximum(:position) || 0
      self.position = last_position + 1
    end
end
